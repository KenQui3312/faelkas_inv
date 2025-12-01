import styled from "styled-components";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  PDFViewer,
} from "@react-pdf/renderer";
import {
  Buscador,
  ListaGenerica,
  useEmpresaStore,
  useProductosStore,
  usePermisosStore,
  BloqueoPagina, // Añade esta importación
  SpinnerLoader, // Añade si necesitas mostrar loading
} from "../../../index";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function KardexEntradaSalida() {
  // Añade verificación de permisos
  const { datapermisos } = usePermisosStore();
  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Reportes") ||
    objeto.modulos.nombre.includes("Kardex")
  );

  const [stateListaproductos, setstateListaProductos] = useState(false);
  const { reportKardexEntradaSalida, buscarProductos, buscador, setBuscador, selectProductos, productoItemSelect } =
    useProductosStore();
  const { dataempresa } = useEmpresaStore();
  
  // ✅ Verificar permisos antes de cargar datos
  const { data, isLoading, error } = useQuery({
    queryKey: ["reporte kardex entrada salida", { 
      _id_empresa: dataempresa?.id,
      _id_producto: productoItemSelect?.id 
    }],
    queryFn: () => reportKardexEntradaSalida({ 
      _id_empresa: dataempresa?.id,
      _id_producto: productoItemSelect?.id 
    }),
    enabled: !!dataempresa && statePermiso, // Solo ejecutar si tiene permisos
  });

  const {
    data: dataproductosbuscador,
    isLoading: ProductosBuscador,
    error: errorBuscador,
  } = useQuery({
    queryKey: [
      "buscar productos",
      { id_empresa: dataempresa?.id, descripcion: buscador },
    ],
    queryFn: () =>
      buscarProductos({ id_empresa: dataempresa?.id, descripcion: buscador }),
    enabled: !!dataempresa && statePermiso,
  });

  const styles = StyleSheet.create({
    page: { flexDirection: "row", position: "relative" },
    section: { margin: 10, padding: 10, flexGrow: 1 },
    table: { width: "100%", margin: "auto", marginTop: 10 },
    row: {
      flexDirection: "row",
      borderBottom: 1,
      borderBottomColor: "#121212",
      alignItems: "stretch",
      height: 24,
      borderLeftColor: "#000",
      borderLeft: 1,
      textAlign: "left",
      justifyContent: "flex-start",
    },
    cell: {
      flex: 1,
      textAlign: "center",
      borderLeftColor: "#000",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    headerCell: {
      flex: 1,
      backgroundColor: "#dcdcdc",
      fontWeight: "bold",
      textAlign: "left",
      justifyContent: "flex-start",
      alignItems: "center",
    },
  });
  
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
  
  const renderTableRow = (rowData, isHeader = false) => (
    <View style={styles.row} key={rowData.id}>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.nombres}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.descripcion}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.tipo}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.cantidad}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.fecha}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.stock}
      </Text>
    </View>
  );

  // ✅ Mostrar BloqueoPagina si no tiene permisos
  if (!statePermiso) {
    return <BloqueoPagina />;
  }

  // ✅ Mostrar loading mientras cargan los datos
  if (isLoading) {
    return (
      <Container>
        <SpinnerLoader />
      </Container>
    );
  }

  // ✅ Mostrar error si hay problemas
  if (error) {
    return (
      <Container>
        <div className="flex justify-center items-center p-8">
          <span className="text-red-500">Error al cargar el reporte de kardex...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Puedes añadir controles de filtro aquí si lo necesitas */}
      <div className="controls">
        <Buscador 
          value={buscador}
          onChange={(e) => setBuscador(e.target.value)}
          placeholder="Buscar producto..."
        />
        {productoItemSelect && (
          <div className="selected-product">
            Producto seleccionado: {productoItemSelect.descripcion}
          </div>
        )}
      </div>

      <PDFViewer className="pdfviewer">
        <Document title="Reporte de Kardex - Entradas y Salidas">
          <Page size="A4" orientation="landscape">
            <View style={styles.page}>
              <View style={styles.section}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "ultrabold",
                    marginBottom: 10,
                  }}
                >
                  Reporte de Kardex - Entradas y Salidas
                </Text>
                {productoItemSelect && (
                  <Text style={{ marginBottom: 5 }}>
                    Producto: {productoItemSelect.descripcion} 
                    {productoItemSelect.codigo && ` (Código: ${productoItemSelect.codigo})`}
                  </Text>
                )}
                <Text>Fecha y hora del reporte: {formattedDate}</Text>
                <View style={styles.table}>
                  {renderTableRow(
                    {
                      nombres: "Usuario",
                      descripcion: "Producto",
                      tipo: "Tipo",
                      cantidad: "Cantidad",
                      fecha: "Fecha",
                      stock: "Stock",
                    },
                    true
                  )}
                  {data?.map((movement, index) => 
                    renderTableRow({ ...movement, id: movement.id || index })
                  )}
                </View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  .controls {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 5px;
  }
  
  .selected-product {
    background: #e3f2fd;
    padding: 5px 10px;
    border-radius: 3px;
    font-weight: 500;
  }
  
  .pdfviewer {
    width: 100%;
    height: 100%;
  }
`;

export default KardexEntradaSalida;