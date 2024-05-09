'use client'

const Email = (props: any) => {
  return (
    <p {...props} className="p-1 lg:p-2 text-sm lg:text-xl font-extralight">
      <a href="#" className="cryptedmail" title="Email link" data-name="selcukcihan" data-domain="gmail.com"
         onClick={() => {
           window.location.href = 'mailto:' + 'selcukcihan' + '@' + 'gmail.com';
           return false;
         }}></a>
    </p>
  )
}

export default Email
