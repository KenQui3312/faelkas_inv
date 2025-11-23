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
} from "../../../index";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function StockActualPorProducto() {
  const [stateListaproductos, setstateListaProductos] = useState(false);
  const { 
    reportStockXproducto, 
    buscarProductos, 
    buscador, 
    setBuscador,
    selectProductos,
    productoItemSelect 
  } = useProductosStore();
  
  const { dataempresa } = useEmpresaStore();

  // ✅ QUERY CORREGIDA
  const { data, isLoading, error } = useQuery({
    queryKey: ["reporte stock por producto", { 
      id_empresa: dataempresa?.id,
      id: productoItemSelect?.id 
    }],
    queryFn: () => reportStockXproducto({ 
      id_empresa: dataempresa?.id,
      id: productoItemSelect?.id
    }),
    enabled: !!dataempresa && !!productoItemSelect?.id,
  });

  const {
    data: dataproductosbuscador,
    isLoading: ProductosBuscador,
    error: errorBuscador,
  } = useQuery({
    queryKey: [
      "buscar productos",
      { descripcion: buscador } // ← Solo el buscador, sin empresa
    ],
    queryFn: () => buscarProductos({ descripcion: buscador }),
    enabled: true, // ← Siempre habilitado, no depende de empresa
  });

  // ✅ MOSTRAR MENSAJE SI NO HAY PRODUCTO SELECCIONADO
  if (!productoItemSelect?.id) {
    return (
      <Container>
        <Buscador
          funcion={() => setstateListaProductos(!stateListaproductos)}
          setBuscador={setBuscador}
        />
        
        {stateListaproductos && (
          <ListaGenerica 
            funcion={(p) => {
              selectProductos(p);
              setBuscador("");
            }}
            setState={() => setstateListaProductos(!stateListaproductos)}
            data={dataproductosbuscador}
          />
        )}

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '50vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <span style={{ fontSize: '18px', color: '#666' }}>
            ⚠️ Selecciona un producto para ver el reporte
          </span>
          <button 
            onClick={() => setstateListaProductos(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Buscar Producto
          </button>
        </div>
      </Container>
    );
  }

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
        {rowData.descripcion}
      </Text>
      <Text style={[styles.cell, isHeader && styles.headerCell]}>
        {rowData.stock}
      </Text>
    </View>
  );
  
  return (
    <Container>
      <Buscador
        funcion={() => setstateListaProductos(!stateListaproductos)}
        setBuscador={setBuscador}
      />
      
      {stateListaproductos && (
        <ListaGenerica 
          funcion={(p) => {
            selectProductos(p);
            setBuscador("");
          }}
          setState={() => setstateListaProductos(!stateListaproductos)}
          data={dataproductosbuscador}
        />
      )}

      <PDFViewer className="pdfviewer">
        <Document title="Reporte de stock por producto">
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
                  Stock actual por producto
                </Text>
                <Text>Producto: {productoItemSelect?.descripcion}</Text>
                <Text>Fecha y hora del reporte: {formattedDate}</Text>
                <View style={styles.table}>
                  {renderTableRow(
                    {
                      descripcion: "Producto",
                      stock: "Stock",
                    },
                    true
                  )}
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

const Container = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  .pdfviewer {
    width: 100%;
    height: 100%;
  }
`;

export default StockActualPorProducto;