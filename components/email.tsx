'use client'

const Email = (props: any) => {
  return (
    <p {...props} className="py-1 lg:py-2 text-base lg:text-3xl font-extralight">
      <a href="#" className="cryptedmail" title="Email link" data-name="selcukcihan" data-domain="gmail.com"
         onClick={() => {
           window.location.href = 'mailto:' + 'selcukcihan' + '@' + 'gmail.com';
           return false;
         }}></a>
    </p>
  )
}

export default Email
