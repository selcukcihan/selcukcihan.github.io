'use client'

const Email = (props: any) => {
  return (
    <p {...props}>
      <a href="#" className="cryptedmail" title="Email link" data-name="selcukcihan" data-domain="gmail.com"
         onClick={() => {
           window.location.href = 'mailto:' + 'selcukcihan' + '@' + 'gmail.com';
           return false;
         }}></a>
    </p>
  )
}

export default Email
