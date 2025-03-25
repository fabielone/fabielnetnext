import { PillsProps } from "../../atoms/pills/pills";
import TwoColumn from "../../layout/twocolumns";



import HeroLeft from "../../molecules/sections/hero_left"
import HeroRight from "../../molecules/sections/hero_right";

export default function Hero() {  

  const pills : PillsProps[] = [
    {text:"Formacion de Negocios",color: "text-gray-500",bgColor: "bg-transparent"},
    {text:"Desarrollow Web",color: "text-gray-500",bgColor: "bg-transparent"},
    {text:"Online Marketing",color: "text-gray-500",bgColor: "bg-transparent"},
    {text:"Agente Registrado",color: "text-gray-500",bgColor: "bg-transparent"},
    {text:"eCommerce",color: "text-gray-500",bgColor: "bg-transparent"},
    {text:"Content Creation",color: "text-gray-500",bgColor: "bg-transparent"},

  ]


  return(
    <>
    <TwoColumn leftContent={<HeroLeft heading={"Fabiel Ramirez"}  pills={pills}/>} rightContent={<HeroRight />}></TwoColumn>
  
    </>
  )

}