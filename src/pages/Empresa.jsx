import { useEmpresaStore } from "../store/EmpresaStore";
import { EmpresaTemplate } from "../components/templates/EmpresaTemplate";

export function Empresa() {
  const { dataempresa } = useEmpresaStore();
  
  // Datos de la empresa con valores por defecto
  const datosEmpresa = {
    nombreEmpresa: dataempresa?.nombre || "Inversiones Faelkas Shop",
    identificacionFiscal: dataempresa?.identificacion_fiscal || "RTN: 0801-1990-12345",
    direccionFiscal: dataempresa?.direccion || "Choluteca, Honduras",
    telefono: dataempresa?.telefono || "+504 1234-5678",
    email: dataempresa?.email || "contacto@faelkas.com",
    logo: dataempresa?.logo_url || null,
    mision: dataempresa?.mision || "Ser la empresa líder en ventas al por menor, ofreciendo productos de calidad y un servicio excepcional que supere las expectativas de nuestros clientes en Honduras.",
    vision: dataempresa?.vision || "Convertirnos en la cadena de tiendas preferida por los hondureños, expandiendo nuestra presencia a nivel nacional con innovación constante y compromiso social.",
  };
  
  return <EmpresaTemplate datosEmpresa={datosEmpresa} />;
}