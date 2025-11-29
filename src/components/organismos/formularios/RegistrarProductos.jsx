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
} from "../../../index";
import { useForm } from "react-hook-form";
import { CirclePicker } from "react-color";
import Emojipicker from "emoji-picker-react";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { Device } from "../../../styles/breakpoints";

export function RegistrarProductos({ onClose, dataSelect, accion }) {
  const { insertarProductos, editarProductos } = useProductosStore();
  const { datamarca, selectMarca, marcaItemSelect, mostrarMarca } = useMarcaStore();
  const { datacategorias, categoriaItemSelect, selectCategoria, mostrarCategorias } = useCategoriasStore();
  const { dataempresa } = useEmpresaStore();
  const [stateMarca, setStateMarca] = useState(false);
  const [stateCategoria, setStateCategoria] = useState(false);
  const [openRegistroMarca, SetopenRegistroMarca] = useState(false);
  const [openRegistroCategoria, SetopenRegistroCategoria] = useState(false);
  const [subaccion, setAccion] = useState("");

  // CARGAR MARCAS Y CATEGORÍAS AL ABRIR EL MODAL
  useEffect(() => {
    console.log("🟡 Modal RegistrarProductos abierto - Cargando datos...");
    
    // Cargar marcas
    if (dataempresa?.id) {
      console.log("🏢 Cargando marcas para empresa:", dataempresa.id);
      mostrarMarca({ id_empresa: dataempresa.id });
    } else {
      console.log("🏢 Cargando todas las marcas (sin empresa)");
      mostrarMarca();
    }

    // Cargar categorías
    if (dataempresa?.id) {
      console.log("🏢 Cargando categorías para empresa:", dataempresa.id);
      mostrarCategorias({ id_empresa: dataempresa.id });
    } else {
      console.log("🏢 Cargando todas las categorías (sin empresa)");
      mostrarCategorias();
    }

    // Si es edición, cargar los datos seleccionados
    if (accion === "Editar") {
      console.log("✏️ Modo edición - Cargando datos del producto:", dataSelect);
      selectMarca({id: dataSelect.idmarca, descripcion: dataSelect.marca});
      selectCategoria({id: dataSelect.id_categoria, descripcion: dataSelect.categoria});
    }
  }, [accion, dataSelect, dataempresa, mostrarMarca, mostrarCategorias, selectMarca, selectCategoria]);

  // DEBUG: Ver estado de las marcas y categorías
  useEffect(() => {
    console.log("📦 Estado de datamarca:", datamarca);
    console.log("🔢 Cantidad de marcas disponibles:", datamarca?.length || 0);
    console.log("🏷️ Marca seleccionada:", marcaItemSelect);
    console.log("📦 Estado de datacategorias:", datacategorias);
    console.log("🔢 Cantidad de categorías disponibles:", datacategorias?.length || 0);
    console.log("🏷️ Categoría seleccionada:", categoriaItemSelect);
  }, [datamarca, marcaItemSelect, datacategorias, categoriaItemSelect]);

  function nuevoRegistroMarca() {
    SetopenRegistroMarca(!openRegistroMarca);
    setAccion("Nuevo");
  }

  function nuevoRegistroCategoria() {
    SetopenRegistroCategoria(!openRegistroCategoria);
    setAccion("Nuevo");
  }

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    watch,
  } = useForm();

  async function insertar(data) {
    if (accion === "Editar") {
      const p = {
        id: dataSelect.id,
        descripcion: data.descripcion,
        idmarca: marcaItemSelect.id,
        stock: parseFloat(data.stock),
        stock_minimo: parseFloat(data.stockminimo),
        codigobarras: parseFloat(data.codigobarras),
        codigointerno: data.codigointerno,
        precioventa: parseFloat(data.precioventa),
        preciocompra: parseFloat(data.preciocompra),
        id_categoria: categoriaItemSelect.id,
        id_empresa: dataempresa.id,
      };

      await editarProductos(p);
      onClose();
    } else {
      const p = {
        _descripcion: data.descripcion,
        _idmarca: marcaItemSelect.id,
        _stock: parseFloat(data.stock),
        _stock_minimo: parseFloat(data.stockminimo),
        _codigobarras: parseFloat(data.codigobarras),
        _codigointerno: data.codigointerno,
        _precioventa: parseFloat(data.precioventa),
        _preciocompra: parseFloat(data.preciocompra),
        _id_categoria: categoriaItemSelect.id,
        _id_empresa: dataempresa?.id,
      };

      await insertarProductos(p);
      onClose();
    }
  }

  // Función para recargar marcas manualmente
  const recargarMarcas = () => {
    console.log("🔄 Recargando marcas manualmente...");
    if (dataempresa?.id) {
      mostrarMarca({ id_empresa: dataempresa.id });
    } else {
      mostrarMarca();
    }
  };

  // Función para recargar categorías manualmente
  const recargarCategorias = () => {
    console.log("🔄 Recargando categorías manualmente...");
    if (dataempresa?.id) {
      mostrarCategorias({ id_empresa: dataempresa.id });
    } else {
      mostrarCategorias();
    }
  };

  return (
    <Container>
      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>
              {accion == "Editar"
                ? "Editar producto"
                : "Registrar nuevo producto"}
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
                  className="form__field"
                  defaultValue={dataSelect.descripcion}
                  type="text"
                  placeholder=""
                  {...register("descripcion", {
                    required: true,
                  })}
                />
                <label className="form__label">Nombre</label>

                {errors.descripcion?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>
            
            <ContainerSelector>
              <label>Marca: </label>
              <Selector
                state={stateMarca}
                color="#fc6027"
                texto1="🍿"
                texto2={marcaItemSelect?.descripcion || "Seleccionar marca"}
                funcion={() => setStateMarca(!stateMarca)}
              />
              
              {/* Botón para recargar marcas */}
              <Btnfiltro
                funcion={recargarMarcas}
                bgcolor="#f6f3f3"
                textcolor="#353535"
                icono={<v.actualizar />}
                title="Recargar marcas"
              />
              
              {/* Botón para agregar nueva marca */}
              <Btnfiltro
                funcion={nuevoRegistroMarca}
                bgcolor="#f6f3f3"
                textcolor="#353535"
                icono={<v.agregar />}
                title="Agregar nueva marca"
              />
              
              {stateMarca && (
                <ListaGenerica
                  bottom="-260px"
                  scroll="scroll"
                  setState={() => setStateMarca(!stateMarca)}
                  data={datamarca || []}
                  funcion={selectMarca}
                />
              )}
            </ContainerSelector>

            <article>
              <InputText icono={<v.iconostock />}>
                <input
                  step="0.01"
                  className="form__field"
                  defaultValue={dataSelect.stock}
                  type="number"
                  placeholder=""
                  {...register("stock", {
                    required: true,
                  })}
                />
                <label className="form__label">Stock</label>

                {errors.stock?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            
            <article>
              <InputText icono={<v.iconostockminimo />}>
                <input
                  step="0.01"
                  className="form__field"
                  defaultValue={dataSelect.stock_minimo}
                  type="number"
                  placeholder=""
                  {...register("stockminimo", {
                    required: true,
                  })}
                />
                <label className="form__label">Stock minimo</label>

                {errors.stockminimo?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>
            
            <ContainerSelector>
              <label>Categoria: </label>
              <Selector
                state={stateCategoria}
                color="#fc6027"
                texto1="🍿"
                texto2={categoriaItemSelect?.descripcion || "Seleccionar categoría"}
                funcion={() => setStateCategoria(!stateCategoria)}
              />
              
              {/* Botón para recargar categorías */}
              <Btnfiltro
                funcion={recargarCategorias}
                bgcolor="#f6f3f3"
                textcolor="#353535"
                icono={<v.actualizar />}
                title="Recargar categorías"
              />
              
              {/* Botón para agregar nueva categoría */}
              <Btnfiltro
                funcion={nuevoRegistroCategoria}
                bgcolor="#f6f3f3"
                textcolor="#353535"
                icono={<v.agregar />}
                title="Agregar nueva categoría"
              />
              
              {stateCategoria && (
                <ListaGenerica
                  bottom="50px"
                  scroll="scroll"
                  setState={() => setStateCategoria(!stateCategoria)}
                  data={datacategorias || []}
                  funcion={selectCategoria}
                />
              )}
            </ContainerSelector>
          </section>
          
          <section className="seccion2">
            <article>
              <InputText icono={<v.iconocodigobarras />}>
                <input
                  className="form__field"
                  defaultValue={dataSelect.codigobarras}
                  type="number"
                  placeholder=""
                  {...register("codigobarras", {
                    required: true,
                  })}
                />
                <label className="form__label">Codigo de barras</label>

                {errors.codigobarras?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>
            
            <article>
              <InputText icono={<v.iconocodigointerno />}>
                <input
                  className="form__field"
                  defaultValue={dataSelect.codigointerno}
                  type="text"
                  placeholder=""
                  {...register("codigointerno", {
                    required: true,
                  })}
                />
                <label className="form__label">Codigo interno</label>

                {errors.codigointerno?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>
            
            <article>
              <InputText icono={<v.iconoprecioventa />}>
                <input
                  step="0.01"
                  className="form__field"
                  defaultValue={dataSelect.precioventa}
                  type="number"
                  placeholder=""
                  {...register("precioventa", {
                    required: true,
                  })}
                />
                <label className="form__label">Precio de venta</label>

                {errors.precioventa?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>
            
            <article>
              <InputText icono={<v.iconopreciocompra />}>
                <input
                  step="0.01"
                  className="form__field"
                  defaultValue={dataSelect.preciocompra}
                  type="number"
                  placeholder=""
                  {...register("preciocompra", {
                    required: true,
                  })}
                />
                <label className="form__label">Precio de compra</label>

                {errors.preciocompra?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>
          </section>
          
          <div className="btnguardarContent">
            <Btnsave
              icono={<v.iconoguardar />}
              titulo="Guardar"
              bgcolor="#EF552B"
            />
          </div>
        </form>
        
        {openRegistroMarca && (
          <RegistrarMarca
            dataSelect={dataSelect}
            onClose={() => SetopenRegistroMarca(!openRegistroMarca)}
            accion={subaccion}
          />
        )}
        
        {openRegistroCategoria && (
          <RegistrarCategorias
            dataSelect={dataSelect}
            onClose={() => SetopenRegistroCategoria(!openRegistroCategoria)}
            accion={subaccion}
          />
        )}
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