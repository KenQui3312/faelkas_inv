import { supabase } from "../index";
import Swal from "sweetalert2";
// Nombre de la tabla en la base de datos
const tabla = "productos";

// Función para insertar nuevos productos
export async function InsertarProductos(p) {
  try {
    // Llamar a la función RPC de Supabase para insertar productos
    const { error } = await supabase.rpc("insertarproductos", p);
    // Si hay error, mostrar alerta con SweetAlert2
    if (error) {
      console.log("parametros", p);
      console.log("parametros", error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
        footer: '<a href="">Agregue una nueva descripcion</a>',
      });
    }
  } catch (error) {
    throw error
  }
}

// Función para obtener todos los productos de una empresa
/*
export async function MostrarProductos(p) {
  try {
    console.log('🔍 Mostrando TODOS los productos (sin filtro)...');
    
    // ✅ TEMPORAL: Mostrar todos los productos sin filtrar por empresa
    const { data, error } = await supabase
      .from('productos')
      .select(`
        *,
        marca:idmarca(descripcion),
        categorias:id_categoria(descripcion, color)
      `)
      .order('id');
    
    if (error) throw error;
    
    console.log('📦 TODOS los productos:', data);
    return data;
    
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}*/
/*
export async function MostrarProductos(p) {
  try {
    console.log('🔍 Mostrando TODOS los productos (sin filtro)...');
    const { data, error } = await supabase
      .from('productos')
      .select(`
        *,
        marca:idmarca(descripcion),
        categorias:id_categoria(descripcion, color),
        empresa:empresa(nombre)
      `)
      .order('id_empresa')
      .order('descripcion');
    if (error) throw error;
    console.log('📦 TODOS los productos con relaciones:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}*/
export async function MostrarProductos(p) {
  try {
    console.log('🔍 Mostrando TODOS los productos (con relaciones completas)...');
    
    const { data, error } = await supabase
      .from('productos')
      .select(`
        id,
        descripcion,
        stock,
        stock_minimo,
        codigobarras,
        codigointerno,
        precioventa,
        preciocompra,
        id_empresa,
        id_categoria,
        idmarca,
        categorias: id_categoria (
          id,
          descripcion,
          color
        ),
        marca: idmarca (
          id,
          descripcion
        ),
        empresa: empresa (
          id,
          nombre
        )
      `)
      .order('id_empresa')
      .order('descripcion');
    
    if (error) throw error;
    
    console.log('📦 Productos con relaciones completas:', data);
    return data;
    
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Función para eliminar un producto específico por ID
export async function EliminarProductos(p) {
  try {
    // Eliminar producto donde el ID coincida
    const { error } = await supabase.from("productos").delete().eq("id", p.id);
    // Si hay error, mostrar alerta
    if (error) {
      alert("Error al eliminar", error);
    }
  } catch (error) {
    // Manejar error mostrando mensaje específico
    alert(error.error_description || error.message + " eliminar productos");
  }
}

// Función para editar un producto existente
export async function EditarProductos(p) {
  try {
    // Actualizar producto donde el ID coincida
    const { error } = await supabase.from("productos").update(p).eq("id", p.id);
    // Si hay error, mostrar alerta
    if (error) {
      alert("Error al editar producto", error);
    }
  } catch (error) {
    // Manejar error mostrando mensaje específico
    alert(error.error_description || error.message + " editar categorias");
  }
}

// Función para buscar productos por descripción
export async function BuscarProductos(p) {
  try {
    console.log("🔍 Buscando productos GLOBAL...", p);
    
    const { data, error } = await supabase.rpc("buscarproductos", {
      buscador: p.descripcion || '', // Solo el buscador, sin id_empresa
    });
    
    if (error) {
      console.error("❌ Error en BuscarProductos:", error);
      return [];
    }
    
    console.log("✅ Productos encontrados (TODAS las empresas):", data?.length || 0, "registros");
    return data || [];
  } catch (error) {
    console.error("💥 Error general en BuscarProductos:", error);
    return [];
  }
}

//REPORTES

// ✅ REPORTE CORREGIDO: Obtener todos los productos (GLOBAL)
export async function ReportStockProductosTodos() {
  try {
    console.log("🔍 Ejecutando ReportStockProductosTodos GLOBAL");
    
    const { data, error } = await supabase
      .from(tabla)
      .select(`
        *,
        empresa:empresa(nombre)
      `)
      .order('id_empresa')
      .order('descripcion');
    
    if (error) {
      console.error("❌ Error en ReportStockProductosTodos:", error);
      return [];
    }
    
    // Formatear datos para incluir nombre de empresa
    const formattedData = data?.map(item => ({
      ...item,
      nombre_empresa: item.empresa?.nombre || `Empresa ${item.id_empresa}`
    }));
    
    console.log("✅ Productos obtenidos (TODAS las empresas):", formattedData?.length || 0);
    return formattedData || [];
  } catch (error) {
    console.error("💥 Error general en ReportStockProductosTodos:", error);
    return [];
  }
}

// ✅ REPORTE CORREGIDO: Obtener un producto específico por ID (GLOBAL)
export async function ReportStockXProducto(p) {
  try {
    // Verificar que tenemos al menos el ID
    if (!p?.id) {
      console.error("❌ ID faltante en ReportStockXProducto:", p);
      return [];
    }
    
    console.log("🔍 Ejecutando ReportStockXProducto GLOBAL:", p);
    
    // Buscar en TODAS las empresas, ignorar id_empresa si se pasa
    const { data, error } = await supabase
      .from(tabla)
      .select()
      .eq("id", p.id); // ← Solo filtrar por ID, no por empresa
    
    if (error) {
      console.error("❌ Error en ReportStockXProducto:", error);
      return [];
    }
    
    console.log("✅ Producto específico encontrado:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("💥 Error general en ReportStockXProducto:", error);
    return [];
  }
}

// Reporte: Obtener productos bajo el stock mínimo
export async function ReportStockBajoMinimo(p) {
  try {
    console.log("🔍 Ejecutando reporte GLOBAL con función RPC");
    
    const { data, error } = await supabase.rpc("reportproductosbajominimo");
    
    if (error) {
      console.error("Error en reporte productos bajo mínimo:", error);
      return [];
    }
    
    console.log("📊 TODOS los productos bajo mínimo:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Error general en ReportStockBajoMinimo:", error);
    return [];
  }
}

// Reporte: Obtener movimientos de kardex (entradas y salidas)
export async function ReportKardexEntradaSalida(p) {
  const { data, error } = await supabase.rpc("mostrarkardexempresa",p)
  if (error) {
    return;
  }
  return data;
}

// Reporte: Obtener inventario valorado (con valores monetarios)
/*
export async function ReportInventarioValorado(p) {
  const { data, error } = await supabase.rpc("inventariovalorado",p)
  
  if (error) {
    return;
  }
  return data;
}
*/
// Reporte: Obtener inventario valorado (GLOBAL)
export async function ReportInventarioValorado() {
  try {
    console.log("🔍 Ejecutando ReportInventarioValorado GLOBAL");
    
    const { data, error } = await supabase
      .from("productos")
      .select(`
        *,
        empresa:empresa(nombre)
      `)
      .order('id_empresa')
      .order('descripcion');
    
    if (error) {
      console.error("❌ Error en ReportInventarioValorado:", error);
      return [];
    }
    
    // Calcular total para cada producto
    const formattedData = data?.map(item => ({
      ...item,
      total: (item.stock * item.preciocompra) || 0,
      nombre_empresa: item.empresa?.nombre || `Empresa ${item.id_empresa}`
    }));
    
    console.log("✅ Inventario valorado obtenido (TODAS las empresas):", formattedData?.length || 0);
    return formattedData || [];
  } catch (error) {
    console.error("💥 Error general en ReportInventarioValorado:", error);
    return [];
  }
}