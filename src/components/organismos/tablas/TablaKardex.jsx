import styled from "styled-components";
import {
  ContentAccionesTabla,
  useCategoriasStore,
  Paginacion,
} from "../../../index";
import Swal from "sweetalert2";
import { v } from "../../../styles/variables";
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FaArrowsAltV } from "react-icons/fa";
import { Device } from "../../../styles/breakpoints";

// Componente de tabla para mostrar el kardex de productos
export function TablaKardex({
  data,
  SetopenRegistro,
  setdataSelect,
  setAccion,
}) {
  // Si no hay datos, no renderizar nada
  if (data?.length == 0) return;

  // Estados para la paginación y datos
  const [pagina, setPagina] = useState(1);
  const [datas, setData] = useState(data);
  const [columnFilters, setColumnFilters] = useState([]);

  const { eliminarCategoria } = useCategoriasStore();

  // Función para eliminar un registro con confirmación
  function eliminar(p) {
    Swal.fire({
      title: "¿Estás seguro(a)(e)?",
      text: "Una vez eliminado, ¡no podrá recuperar este registro!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(p);
        await eliminarCategoria({ id: p });
      }
    });
  }

  // Función para editar un registro
  function editar(data) {
    SetopenRegistro(true);
    setdataSelect(data);
    setAccion("Editar");
  }

  // Definición de columnas para la tabla
  const columns = [
    {
      accessorKey: "descripcion",
      header: "Producto",
      cell: (info) => <span>{info.getValue()}</span>,
      enableColumnFilter: true,
      filterFn: (row, columnId, filterStatuses) => {
        if (filterStatuses.length === 0) return true;
        const status = row.getValue(columnId);
        return filterStatuses.includes(status?.id);
      },
    },
    {
      accessorKey: "fecha",
      header: "Fecha",
      enableSorting: false,
      cell: (info) => (
        <span className="ContentCell" data-title="Fecha">
          {info.getValue()}
        </span>
      ),
      enableColumnFilter: true,
      filterFn: (row, columnId, filterStatuses) => {
        if (filterStatuses.length === 0) return true;
        const status = row.getValue(columnId);
        return filterStatuses.includes(status?.id);
      },
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      enableSorting: false,
      cell: (info) => (
        <div className="ContentCell" data-title="Tipo">
          {/* Mostrar tipo con color diferente para salida/entrada */}
          {info.getValue() == "salida" ? (
            <Colorcontent color="#ed4d4d" className="contentCategoria">
              {info.getValue()}
            </Colorcontent>
          ) : (
            <Colorcontent color="#30c85b" className="contentCategoria">
              {info.getValue()}
            </Colorcontent>
          )}
        </div>
      ),
      enableColumnFilter: true,
      filterFn: (row, columnId, filterStatuses) => {
        if (filterStatuses.length === 0) return true;
        const status = row.getValue(columnId);
        return filterStatuses.includes(status?.id);
      },
    },
    {
      accessorKey: "detalle",
      header: "Detalle",
      enableSorting: false,
      cell: (info) => (
        <span className="ContentCell" data-title="Usuario">
          {info.getValue()}
        </span>
      ),
      enableColumnFilter: true,
      filterFn: (row, columnId, filterStatuses) => {
        if (filterStatuses.length === 0) return true;
        const status = row.getValue(columnId);
        return filterStatuses.includes(status?.id);
      },
    },
    {
      accessorKey: "nombres",
      header: "Usuario",
      enableSorting: false,
      cell: (info) => (
        <span className="ContentCell" data-title="Usuario">
          {info.getValue()}
        </span>
      ),
      enableColumnFilter: true,
      filterFn: (row, columnId, filterStatuses) => {
        if (filterStatuses.length === 0) return true;
        const status = row.getValue(columnId);
        return filterStatuses.includes(status?.id);
      },
    },
    {
      accessorKey: "cantidad",
      header: "Cantidad",
      enableSorting: false,
      cell: (info) => (
        <span className="ContentCell" data-title="Cantidad">
          {info.getValue()}
        </span>
      ),
      enableColumnFilter: true,
      filterFn: (row, columnId, filterStatuses) => {
        if (filterStatuses.length === 0) return true;
        const status = row.getValue(columnId);
        return filterStatuses.includes(status?.id);
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
      enableSorting: false,
      cell: (info) => (
        <span className="ContentCell" data-title="Stock">
          {info.getValue()}
        </span>
      ),
      enableColumnFilter: true,
      filterFn: (row, columnId, filterStatuses) => {
        if (filterStatuses.length === 0) return true;
        const status = row.getValue(columnId);
        return filterStatuses.includes(status?.id);
      },
    },
  ];

  // Configuración de la tabla con React Table
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value,
                }
              : row
          )
        ),
    },
  });

  return (
    <>
      <Container>
        {/* Tabla responsiva */}
        <table className="responsive-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {/* Encabezado de columna */}
                    {header.column.columnDef.header}
                    
                    {/* Ícono para ordenar si la columna es ordenable */}
                    {header.column.getCanSort() && (
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <FaArrowsAltV />
                      </span>
                    )}
                    
                    {/* Indicador de dirección de ordenamiento */}
                    {
                      {
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()]
                    }
                    
                    {/* Handler para redimensionar columnas */}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`resizer ${
                        header.column.getIsResizing() ? "isResizing" : ""
                      }`}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {/* Filas de datos */}
            {table.getRowModel().rows.map((item) => (
              <tr key={item.id}>
                {item.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {/* Renderizar celda */}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Componente de paginación */}
        <Paginacion
          table={table}
          irinicio={() => table.setPageIndex(0)}
          pagina={table.getState().pagination.pageIndex + 1}
          setPagina={setPagina}
          maximo={table.getPageCount()}
        />
      </Container>
    </>
  );
}

// Estilos del contenedor principal
const Container = styled.div`
  position: relative;
  margin: 5% 3%;
  
  @media (min-width: ${v.bpbart}) {
    margin: 2%;
  }
  
  @media (min-width: ${v.bphomer}) {
    margin: 2em auto;
  }

  .responsive-table {
    width: 100%;
    margin-bottom: 1.5em;
    border-spacing: 0;
    
    @media (min-width: ${v.bpbart}) {
      font-size: 0.9em;
    }
    
    @media (min-width: ${v.bpmarge}) {
      font-size: 1em;
    }

    thead {
      position: absolute;
      padding: 0;
      border: 0;
      height: 1px;
      width: 1px;
      overflow: hidden;
      
      @media (min-width: ${v.bpbart}) {
        position: relative;
        height: auto;
        width: auto;
        overflow: auto;
      }
      
      th {
        border-bottom: 2px solid rgba(115, 115, 115, 0.32);
        font-weight: normal;
        text-align: center;
        color: ${({ theme }) => theme.text};
        
        &:first-of-type {
          text-align: center;
        }
      }
    }

    tbody,
    tr,
    th,
    td {
      display: block;
      padding: 0;
      text-align: left;
      white-space: normal;
    }
    
    tr {
      @media (min-width: ${v.bpbart}) {
        display: table-row;
      }
    }

    th,
    td {
      padding: 0.5em;
      vertical-align: middle;
      
      @media (min-width: ${v.bplisa}) {
        padding: 0.75em 0.5em;
      }
      
      @media (min-width: ${v.bpbart}) {
        display: table-cell;
        padding: 0.5em;
      }
      
      @media (min-width: ${v.bpmarge}) {
        padding: 0.75em 0.5em;
      }
      
      @media (min-width: ${v.bphomer}) {
        padding: 0.75em;
      }
    }

    tbody {
      @media (min-width: ${v.bpbart}) {
        display: table-row-group;
      }
      
      tr {
        margin-bottom: 1em;
        
        @media (min-width: ${v.bpbart}) {
          display: table-row;
          border-width: 1px;
        }
        
        &:last-of-type {
          margin-bottom: 0;
        }
        
        &:nth-of-type(even) {
          @media (min-width: ${v.bpbart}) {
            background-color: rgba(78, 78, 78, 0.12);
          }
        }
      }
      
      th[scope="row"] {
        @media (min-width: ${v.bplisa}) {
          border-bottom: 1px solid rgba(161, 161, 161, 0.32);
        }
        
        @media (min-width: ${v.bpbart}) {
          background-color: transparent;
          text-align: center;
          color: ${({ theme }) => theme.text};
        }
      }
      
      .ContentCell {
        text-align: right;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid rgba(161, 161, 161, 0.32);
        
        @media (min-width: ${v.bpbart}) {
          justify-content: center;
          border-bottom: none;
        }
      }
      
      td {
        text-align: right;
        
        @media (min-width: ${v.bpbart}) {
          border-bottom: 1px solid rgba(161, 161, 161, 0.32);
          text-align: center;
        }
      }
      
      td[data-title]:before {
        content: attr(data-title);
        float: left;
        font-size: 0.8em;
        
        @media (min-width: ${v.bplisa}) {
          font-size: 0.9em;
        }
        
        @media (min-width: ${v.bpbart}) {
          content: none;
        }
      }
    }
  }
`;

// Componente estilizado para mostrar tipos con colores
const Colorcontent = styled.div`
  color: ${(props) => props.color};
  border-radius: 8px;
  border: 1px dashed ${(props) => props.color};
  text-align: center;
  padding: 3px;
  width: 70%;
  font-weight: 700;
  
  @media ${Device.tablet} {
    width: 100%;
  }
`;