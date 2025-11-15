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
import { useEmpresaStore, useProductosStore } from "../../../index";
import { useQuery } from "@tanstack/react-query";
// Componente para generar reporte PDF de productos con stock bajo mínimo
function StockBajoMinimo() {
  // Obtener funciones y datos de los stores
  const { reportBajoMinimo } = useProductosStore();
  const { dataempresa } = useEmpresaStore();
  
  console.log("🏢 Empresa actual:", dataempresa);

  // Query para obtener datos del reporte de stock bajo mínimo
  const { data, isLoading, error } = useQuery({
    queryKey: ["reporte stock bajo minimo", { id_empresa: dataempresa?.id }],
    queryFn: () => {
      console.log("🔍 Ejecutando query con empresa:", dataempresa?.id);
      return reportBajoMinimo({ id_empresa: dataempresa?.id });
    },
    enabled: !!dataempresa,
    onSuccess: (data) => {
      console.log("✅ Datos recibidos:", data);
      console.log("📊 Cantidad de productos bajo mínimo:", data?.length);
    },
    onError: (error) => {
      console.error("❌ Error en query:", error);
    }
  });

  // Mostrar estados de carga y error
  if (isLoading) {
    console.log("⏳ Cargando datos...");
    return <span>Cargando...</span>;
  }
  
  if (error) {
    console.error("💥 Error completo:", error);
    return <span>Error: {error.message}</span>;
  }

  console.log("🎯 Datos para renderizar:", data);

  // Estilos para el documento PDF
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

  // Obtener fecha y hora actual para el reporte
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
  
  // Función para renderizar filas de la tabla
  const renderTableRow = (rowData, isHeader = false) => (
    <View style={styles.row} key={rowData.id}>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.descripcion}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.stock}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.stock_minimo}
      </Text>
    </View>
  );
  
  return (
    <Container>
      {/* Visor del documento PDF */}
      <PDFViewer className="pdfviewer">
        <Document title="Reporte de stock todos">
          <Page size="A4" orientation="portrait">
            <View style={styles.page}>
              <View style={styles.section}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "ultrabold",
                    marginBottom: 10,
                  }}
                >
                  Stock bajo minimo
                </Text>
                <Text>Fecha y hora del reporte: {formattedDate}</Text>
                <View style={styles.table}>
                  {renderTableRow(
                    {
                      descripcion: "Producto",
                      stock: "Stock",
                      stock_minimo: "Stock Minimo"
                    },
                    true
                  )}
                  {/* Filas de datos de productos */}
                  {data?.map((movement) => renderTableRow(movement))}
                </View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </Container>
  );
}

// Contenedor estilizado para el visor PDF
const Container = styled.div`
  width: 100%;
  height: 80vh;
  .pdfviewer {
    width: 100%;
    height: 100%;
  }
`;

export default StockBajoMinimo;