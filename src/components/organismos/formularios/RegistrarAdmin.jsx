import { useEffect, useState } from "react";
import styled from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Spinner,
  useOperaciones,
  Btnsave,
  useUsuariosStore,
  useCategoriasStore,
  useAuthStore,
  supabase,
} from "../../../index";
import { useForm } from "react-hook-form";
import { CirclePicker } from "react-color";
import Emojipicker from "emoji-picker-react";
import { MdAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function RegistrarAdmin({ state, setState }) {
  const { insertarUsuarioAdmin } = useUsuariosStore();
  const { signInWithEmail } = useAuthStore();
  const navigate = useNavigate();

  const [stateInicio, setStateInicio] = useState(true);
  const [registroExitoso, setRegistroExitoso] = useState(false); // ✅ Nuevo estado

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const p = {
        correo: data.correo,
        pass: data.pass,
        tipouser: "superadmin",
      };

      console.log("🔵 Iniciando registro con datos:", p);

      const dt = await insertarUsuarioAdmin(p);

      if (dt) {
        console.log("✅ Registro exitoso en Auth y base de datos");
        setRegistroExitoso(true); // ✅ Marcar registro como exitoso
        
        // ✅ Intentar login automático (pero no es crítico si falla)
        try {
          console.log("🔵 Intentando login automático...");
          await signInWithEmail(data.correo, data.pass);
          console.log("✅ Login automático exitoso");
          navigate("/");
        } catch (error) {
          console.warn("⚠️ Login automático falló, pero el registro fue exitoso:", error.message);
          // ✅ No es crítico - mostrar mensaje de éxito y redirigir a login
          setTimeout(() => {
            navigate("/login", { 
              state: { 
                message: "registro_exitoso",
                email: data.correo 
              } 
            });
          }, 1500);
        }
      } else {
        console.log("❌ Registro falló");
        setStateInicio(!stateInicio);
      }

      return dt;
    },
    onError: (error) => {
      console.error("Error en el registro:", error);
      setStateInicio(!stateInicio);
    },
  });

  // ✅ Muestra un spinner mientras se procesa la mutación
  if (mutation.isPending) {
    return (
      <Container>
        <Spinner />
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Registrando usuario...</p>
      </Container>
    );
  }

  // ✅ Mostrar mensaje de éxito si el registro fue exitoso pero el login falló
  if (registroExitoso && !mutation.isPending) {
    return (
      <Container>
        <ContentClose>
          <span onClick={() => setState(false)}>x</span>
        </ContentClose>
        
        <section className="subcontainer">
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#4caf50'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
            <h2>¡Registro Exitoso!</h2>
            <p>Tu cuenta ha sido creada correctamente.</p>
            <p>Ahora puedes iniciar sesión con tu email y contraseña.</p>
            <button 
              onClick={() => navigate("/login")}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#ff7556',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        </section>
      </Container>
    );
  }

  return (
    <Container>
      <ContentClose>
        <span onClick={() => setState(false)}>x</span>
      </ContentClose>

      <section className="subcontainer">
        <div className="headers">
          <section>
            <h1>Registrar usuario</h1>
          </section>
        </div>

        <form
          className="formulario"
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
        >
          <section>
            <article>
              <InputText icono={<MdAlternateEmail />}>
                <input
                  className="form__field"
                  style={{ textTransform: "lowercase" }}
                  type="email"
                  placeholder="correo"
                  {...register("correo", {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                  })}
                />
                <label className="form__label">email</label>
                {errors.correo?.type === "pattern" && (
                  <p>El formato del email es incorrecto</p>
                )}
                {errors.correo?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>

            <article>
              <InputText icono={<RiLockPasswordLine />}>
                <input
                  className="form__field"
                  type="password"
                  placeholder="pass"
                  {...register("pass", {
                    required: true,
                    minLength: 6,
                  })}
                />
                <label className="form__label">pass</label>
                {errors.pass?.type === "required" && <p>Campo requerido</p>}
                {errors.pass?.type === "minLength" && (
                  <p>Mínimo 6 caracteres</p>
                )}
              </InputText>
            </article>

            <div className="btnguardarContent">
              <Btnsave
                icono={<v.iconoguardar />}
                titulo="Guardar"
                bgcolor="#ff7556"
                type="submit"
                disabled={mutation.isPending}
              />
            </div>
          </section>
        </form>

        {mutation.isError && (
          <div style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            Error en el registro: {mutation.error.message}
          </div>
        )}
      </section>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  border-radius: 20px;
  background: #fff;
  box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
  padding: 13px 36px 20px 36px;
  z-index: 100;
  display: flex;
  align-items: center;

  .subcontainer {
    width: 100%;
  }

  .headers {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      font-size: 20px;
      font-weight: 500;
    }
    span {
      font-size: 20px;
      cursor: pointer;
    }
  }

  .formulario {
    section {
      gap: 20px;
      display: flex;
      flex-direction: column;
      .colorContainer {
        .colorPickerContent {
          padding-top: 15px;
          min-height: 50px;
        }
      }
    }
  }
`;

const ContentClose = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 33px;
  margin: 30px;
  cursor: pointer;
`;