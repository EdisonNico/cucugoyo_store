
import { STORE } from '../config/store'

export default function Terms() {
  return (
    <div className="page prose">
      <h1>Términos y condiciones</h1>

      <p>
        Bienvenido/a a <strong>{STORE.name}</strong>,
        una tienda especializada en cartas coleccionables
        Pokémon y productos sellados. Al utilizar nuestro
        sitio web, te recomendamos revisar estos términos
        antes de coordinar una compra.
      </p>

      <h2>1. Información general</h2>
      <p>
        Nuestra tienda ofrece cartas Pokémon individuales,
        sobres, cajas y otros productos relacionados con
        Pokémon TCG. Los precios se expresan en soles
        peruanos (PEN).
      </p>
      <p>
        El sitio web funciona como un catálogo informativo
        que permite visualizar los productos disponibles,
        sus precios, fotografías y descripciones. La
        disponibilidad se actualiza según el inventario
        de la tienda.
      </p>

      <h2>2. Cartas individuales y estado de conservación</h2>
      <p>
        Cada carta se publica con la información disponible
        sobre su nombre, edición, idioma, rareza y estado
        de conservación.
      </p>
      <p>
        Antes de concretar una compra, el cliente debe
        revisar cuidadosamente las fotografías y la
        descripción del producto. Si necesita información
        adicional, puede solicitarla por WhatsApp antes
        de coordinar la entrega.
      </p>

      <h2>3. Productos sellados</h2>
      <p>
        Ofrecemos sobres, cajas y otros productos de
        Pokémon TCG. Los artículos anunciados como
        sellados se ofrecen sellados de fábrica.
      </p>
      <p>
        El contenido de los sobres y productos aleatorios
        depende de su distribución de fábrica. Por ello,
        no se garantiza la obtención de cartas específicas
        ni de una rareza determinada.
      </p>

      <h2>4. Autenticidad de los productos</h2>
      <p>
        Todos los productos ofrecidos por la tienda son
        100% originales. Procuramos proporcionar
        fotografías y descripciones claras para que el
        cliente pueda identificar el artículo que desea
        adquirir.
      </p>

      <h2>5. Precios, disponibilidad y compras</h2>
      <p>
        Los precios y la disponibilidad se muestran en
        el catálogo web y pueden actualizarse cuando
        cambie el inventario.
      </p>
      <p>
        Todas las compras se coordinan exclusivamente
        mediante WhatsApp. La página web no procesa
        pedidos ni pagos directamente. La compra queda
        coordinada cuando ambas partes acuerdan el
        producto, el precio y las condiciones de entrega.
      </p>

      <h2>6. Métodos de pago</h2>
      <p>
        No solicitamos pagos adelantados ni anticipos.
        El pago se realiza el mismo día de la entrega
        del producto, según lo coordinado previamente
        con el cliente por WhatsApp.
      </p>

      <h2>7. Envíos y entregas</h2>
      <p>
        Las condiciones y el lugar de entrega se coordinan
        directamente con el cliente por WhatsApp antes
        de concretar la compra.
      </p>
      <p>
        El cliente debe verificar que el producto recibido
        corresponda al artículo acordado.
      </p>

      <h2>8. Revisión del producto antes de la entrega</h2>
      <p>
        Antes de aceptar el producto y completar el pago,
        el cliente debe revisar cuidadosamente su estado,
        apariencia, edición, idioma y demás características
        relevantes, según corresponda.
      </p>
      <p>
        Si tiene alguna duda o detecta una diferencia
        respecto de lo acordado, debe comunicarla antes
        de finalizar la entrega.
      </p>

      <h2>9. Cambios, devoluciones y reclamos</h2>
      <p>
        Como política comercial, no aceptamos cambios
        ni devoluciones por motivos de preferencia
        personal una vez concretada la entrega.
      </p>
      <p>
        Por este motivo, recomendamos revisar el producto
        detenidamente antes de aceptarlo y completar
        el pago. Esta política no limita los derechos
        que pudieran corresponder al consumidor conforme
        a la normativa aplicable.
      </p>

      <h2>10. Uso del sitio web</h2>
      <p>
        El sitio web tiene como única finalidad mostrar
        el catálogo de cartas y productos disponibles,
        sus precios, fotografías, descripciones y el
        número de contacto de la tienda.
      </p>
      <p>
        No contamos con registro de usuarios, cuentas
        personales ni un sistema de pago integrado.
        Para consultar, coordinar o realizar una compra,
        el cliente debe comunicarse directamente con
        nosotros por WhatsApp.
      </p>

      <h2>11. Atención al cliente</h2>
      <p>
        Nuestra atención al cliente está disponible
        las 24 horas del día, los 7 días de la semana,
        a través de WhatsApp.
      </p>
      <p>
        Las consultas sobre productos, disponibilidad,
        precios y entregas se atienden por este medio.
        El tiempo de respuesta puede variar según
        el volumen de mensajes recibidos.
      </p>
    </div>
  )
}
