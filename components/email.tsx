'use client'

const Email = (props: any) => {
  const mobileScreen = !!props.mobileScreen
  const hoverEffect = 'hover:text-secondary-2 dark:hover:text-light-0 '
  const className = hoverEffect + (mobileScreen
    ? 'text-2xl font-light pb-4 underline underline-offset-4'
    : 'hidden lg:block py-2 text-3xl font-extralight underline underline-offset-8')
  return (
    <p className={className}>
      <a href="#" className="cryptedmail" title="Email link" data-name="selcukcihan" data-domain="gmail.com"
         onClick={() => {
           window.location.href = 'mailto:' + 'selcukcihan' + '@' + 'gmail.com';
           return false;
         }}></a>
    </p>
  )
}

export default Email
