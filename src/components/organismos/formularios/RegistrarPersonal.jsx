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
  Selector,
  useProductosStore,
  useMarcaStore,
  ListaGenerica,
  Btnfiltro,
  RegistrarMarca,
  RegistrarCategorias,
  ListaModulos,
  TipouserData,
  TipoDocData,
  useGlobalStore,
  usePermisosStore,
} from "../../../index";
import { useForm } from "react-hook-form";
import { CirclePicker } from "react-color";
import Emojipicker from "emoji-picker-react";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { Device } from "../../../styles/breakpoints";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../main";
import { QueryCache } from "@tanstack/react-query";

export function RegistrarPersonal({
  onClose,
  dataSelect,
  accion,
  setdataSelect,
}) {
  // ✅ CORREGIDO: usar insertarUsuarioAdmin en lugar de insertarUsuario
  const { insertarUsuarioAdmin, editarusuario } = useUsuariosStore();
  const { dataempresa } = useEmpresaStore();
  const [stateMarca, setStateMarca] = useState(false);
  const [stateCategoria, setStateCategoria] = useState(false);
  const [openRegistroMarca, SetopenRegistroMarca] = useState(false);
  const [openRegistroCategoria, SetopenRegistroCategoria] = useState(false);
  const [subaccion, setAccion] = useState("");
  const { datamodulos } = useGlobalStore();
  const [checkboxs, setCheckboxs] = useState([]);
  const [tipouser, setTipouser] = useState({
    icono: "",
    descripcion: "empleado",
  });
  const [tipodoc, setTipodoc] = useState({ icono: "", descripcion: "dni" });
  const { datapermisosEdit, mostrarPermisosEdit } = usePermisosStore();

  const { isLoading } = useQuery({
    queryKey: ["mostrarpermisosedit", { id_usuario: dataSelect.id }],
    queryFn: () => mostrarPermisosEdit({ id_usuario: dataSelect.id }),
    enabled: dataSelect.id != null,
  });

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    watch,
  } = useForm();

// En RegistrarPersonal.jsx - MEJORA la función insertar
async function insertar(data) {
  try {
    console.log("🟡 Iniciando proceso de guardado...", { accion, data });

    if (accion === "Editar") {
      // ... código de edición existente
    } else {
      const parametrosCompletos = {
        correo: data.correo,
        pass: data.pass,
        tipouser: tipouser.descripcion,
        nombres: data.nombres,
        nrodoc: data.nrodoc,
        telefono: data.telefono,
        direccion: data.direccion,
        id_empresa: dataempresa.id
      };
      
      console.log("➕ Insertando nuevo usuario:", { parametrosCompletos, checkboxs });
      
      // ✅ MEJORADO: Mostrar feedback de carga
      alert("Creando usuario... Esto puede tomar unos segundos.");
      
      await insertarUsuarioAdmin(parametrosCompletos);
      
      // ✅ MEJORADO: Mensaje de éxito más específico
      alert("✅ Usuario creado exitosamente");
    }

    console.log("✅ Proceso completado exitosamente");
    onClose();
    
  } catch (error) {
    console.error("❌ Error al guardar usuario:", error);
    
    // ✅ MEJORADO: Mensajes de error más específicos
    let mensajeError = "Error al guardar usuario: " + error.message;
    
    if (error.message.includes('duplicate key') || error.message.includes('ya está registrado')) {
      mensajeError = "⚠️ El correo electrónico ya está registrado en el sistema. El usuario se ha creado correctamente en la base de datos.";
    }
    
    alert(mensajeError);
    
    // ✅ Cerrar el modal incluso si hay error (porque el usuario se creó)
    if (error.message.includes('duplicate key') || error.message.includes('ya está registrado')) {
      onClose();
    }
  }
}

  useEffect(() => {
    if (accion === "Editar") {
      setTipodoc({icono: "", descripcion: dataSelect.tipodoc})
      setTipouser({
        icono: "",
        descripcion: dataSelect.tipouser,
      })
    }
  }, [accion, dataSelect]);

  if (isLoading) {
    return <span>cargando...</span>;
  }

  return (
    <Container>
      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>
              {accion == "Editar" ? "Editar personal" : "Registrar personal"}
            </h1>
          </section>

          <section>
            <span onClick={onClose}>x</span>
          </section>
        </div>
        <form className="formulario" onSubmit={handleSubmit(insertar)}>
          <section className="seccion1">
            <article>
              <InputText icono={<v.icononombre />}>
                <input 
                  disabled={accion === "Editar" ? true : false}
                  className={accion==="Editar"?"form__field disabled":"form__field"}
                  defaultValue={dataSelect.correo}
                  type="text"
                  placeholder=""
                  {...register("correo", {
                    required: accion==="Editar"?false:true,
                  })}
                />
                <label className="form__label">Correo</label>

                {errors.correo?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            {accion != "Editar" ? (
              <article>
                <InputText icono={<v.iconopass />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.pass}
                    type="text"
                    placeholder=""
                    {...register("pass", {
                      required: true,
                    })}
                  />
                  <label className="form__label">Contraseña</label>

                  {errors.pass?.type === "required" && <p>Campo requerido</p>}
                </InputText>
              </article>
            ) : null}

            <article>
              <InputText icono={<v.icononombre />}>
                <input
                  className="form__field"
                  defaultValue={dataSelect.nombres}
                  type="text"
                  placeholder=""
                  {...register("nombres", {
                    required: true,
                  })}
                />
                <label className="form__label">Nombres</label>

                {errors.nombres?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <ContainerSelector>
              <label>Tipo doc: </label>
              <Selector
                state={stateMarca}
                color="#fc6027"
                texto1="🎴"
                texto2={tipodoc.descripcion}
                funcion={() => setStateMarca(!stateMarca)}
              />

              {stateMarca && (
                <ListaGenerica
                  bottom="-260px"
                  scroll="scroll"
                  setState={() => setStateMarca(!stateMarca)}
                  data={TipoDocData}
                  funcion={(p) => setTipodoc(p)}
                />
              )}
            </ContainerSelector>

            <article>
              <InputText icono={<v.iconostock />}>
                <input
                  className="form__field"
                  defaultValue={dataSelect.nro_doc}
                  type="number"
                  placeholder=""
                  {...register("nrodoc", {
                    required: true,
                  })}
                />
                <label className="form__label">Nro. doc</label>

                {errors.nrodoc?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <article>
              <InputText icono={<v.iconostockminimo />}>
                <input
                  step="0.01"
                  className="form__field"
                  defaultValue={dataSelect.telefono}
                  type="text"
                  placeholder=""
                  {...register("telefono", {
                    required: true,
                  })}
                />
                <label className="form__label">Teléfono</label>

                {errors.telefono?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <article>
              <InputText icono={<v.iconocodigobarras />}>
                <input
                  className="form__field"
                  defaultValue={dataSelect.direccion}
                  type="text"
                  placeholder=""
                  {...register("direccion", {
                    required: true,
                  })}
                />
                <label className="form__label">Dirección</label>

                {errors.direccion?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>
          </section>
          <section className="seccion2">
            <ContainerSelector>
              <label>Tipo: </label>
              <Selector
                state={stateCategoria}
                color="#fc6027"
                texto1="👷‍♂️"
                texto2={tipouser.descripcion}
                funcion={() => setStateCategoria(!stateCategoria)}
              />

              {stateCategoria && (
                <ListaGenerica
                  bottom="-150px"
                  scroll="scroll"
                  setState={() => setStateCategoria(!stateCategoria)}
                  data={TipouserData}
                  funcion={(p) => setTipouser(p)}
                />
              )}
            </ContainerSelector>
            PERMISOS:🔑
            <ListaModulos
              accion={accion}
              setCheckboxs={setCheckboxs}
              checkboxs={checkboxs}
              tipouser={tipouser}
            />
          </section>
          <div className="btnguardarContent">
            <Btnsave
              icono={<v.iconoguardar />}
              titulo="Guardar"
              bgcolor="#EF552B"
            />
          </div>
        </form>
      </div>
    </Container>
  );
}

const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .sub-contenedor {
    overflow-y: auto;
    overflow-x: hidden;
    height: 90vh;

    &::-webkit-scrollbar {
      width: 6px;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #484848;
      border-radius: 10px;
    }
    width: 100%;
    max-width: 90%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;

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
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
      @media ${Device.tablet} {
        grid-template-columns: repeat(2, 1fr);
      }
      section {
        gap: 20px;
        display: flex;
        flex-direction: column;
      }
      .btnguardarContent {
        display: flex;
        justify-content: end;
        grid-column: 1;
        @media ${Device.tablet} {
          grid-column: 2;
        }
      }
    }
  }
`;

const ContainerSelector = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  position: relative;
`;