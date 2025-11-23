import styled from "styled-components";
import {
  ContentAccionesTabla,
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

export function TablaProductos({
  data,
  categorias = [],  // ← Recibir categorías
  onEditar,
  onRecargar
}) {
  // ✅ DEBUG: Verificar que las categorías lleguen correctamente
  console.log('📦 TablaProductos - categorías recibidas:', categorias);
  console.log('📦 TablaProductos - primera categoría:', categorias[0]);
  
  // ✅ Si no hay datos, mostrar mensaje
  if (!data || data.length === 0) {
    return (
      <Container>
        <div className="text-center py-8 text-gray-500">
          No hay productos para mostrar
        </div>
      </Container>
    );
  }

  const [pagina, setPagina] = useState(1);
  const [datas, setData] = useState(data);
  const [columnFilters, setColumnFilters] = useState([]);

  // ✅ Función para eliminar producto
  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro(a)(e)?",
      text: "Una vez eliminado, ¡no podrá recuperar este registro!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
    });

    if (result.isConfirmed) {
      try {
        const { EliminarProductos } = await import("../../../index");
        await EliminarProductos({ id });
        
        Swal.fire({
          title: "¡Eliminado!",
          text: "El producto ha sido eliminado.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });

        if (onRecargar) {
          onRecargar();
        }
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el producto",
          icon: "error",
        });
      }
    }
  };

  // ✅ Función para editar
  const editar = (data) => {
    if (onEditar) {
      onEditar(data);
    }
  };

  const columns = [
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      accessorKey: "stock_minimo",
      header: "Stock min",
      enableSorting: false,
      cell: (info) => (
        <span className="ContentCell" data-title="Stock">
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: "id_categoria",  // ← Usar id_categoria para buscar
      header: "Categoría",
      enableSorting: false,
      cell: (info) => {
        const idCategoria = info.getValue();
        
        // ✅ BUSCAR la categoría por ID - CORREGIDO: usar descripcion
        const categoria = categorias.find(cat => cat.id === idCategoria);
        
        console.log('🔍 Buscando categoría:', {
          idCategoria,
          categoria,
          totalCategorias: categorias.length
        });

        return (
          <div className="ContentCell" data-title="Categoria">
            <Colorcontent
              color={categoria?.color || '#666'}
              className="contentCategoria"
            >
              {categoria?.descripcion || `ID: ${idCategoria}`} {/* ← CORREGIDO: descripcion */}
            </Colorcontent>
          </div>
        );
      },
    },
    {
      accessorKey: "codigobarras",
      header: "Cod. barras",
      enableSorting: false,
      cell: (info) => (
        <span className="ContentCell" data-title="Cod. barras">
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: "precioventa",
      header: "Pr. venta",
      enableSorting: false,
      cell: (info) => (
        <span className="ContentCell" data-title="Precio venta">
          ${info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: "preciocompra",
      header: "Pr. compra",
      enableSorting: false,
      cell: (info) => (
        <span className="ContentCell" data-title="Precio compra">
          ${info.getValue()}
        </span>
      ),
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
    },
    {
      accessorKey: "acciones",
      header: "Acciones",
      enableSorting: false,
      cell: (info) => (
        <div className="ContentCell" data-title="Acciones">
          <ContentAccionesTabla
            funcionEditar={() => editar(info.row.original)}
            funcionEliminar={() => eliminar(info.row.original.id)}
          />
        </div>
      ),
    },
  ];

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
    <Container>
      <table className="responsive-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.column.columnDef.header}
                  {header.column.getCanSort() && (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <FaArrowsAltV />
                    </span>
                  )}
                  {
                    {
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted()]
                  }
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
          {table.getRowModel().rows.map((item) => (
            <tr key={item.id}>
              {item.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Paginacion
        table={table}
        irinicio={() => table.setPageIndex(0)}
        pagina={table.getState().pagination.pageIndex + 1}
        setPagina={setPagina}
        maximo={table.getPageCount()}
      />
    </Container>
  );
}

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
        
        .contentCategoria {
          color: ${(props) => props.color};
          background-color: ${(props) => props.color};
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

const Colorcontent = styled.div`
  color: ${(props) => props.color};
  border-radius: 8px;
  border: 1px dashed ${(props) => props.color};
  text-align: center;
  padding: 3px;
  width: 70%;
  
  @media ${Device.tablet} {
    width: 100%;
  }
`;