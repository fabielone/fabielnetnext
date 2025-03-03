import { PillsProps } from "../../atoms/pills/pills";
import TwoColumn from "../../layout/twocolumns";



import HeroLeft from "../../molecules/sections/hero_left"
import HeroRight from "../../molecules/sections/hero_right";

export default function Hero() {  

  const pills : PillsProps[] = [
    {text:"Web Development",color: "text-gray-500",bgColor: "bg-transparent"},
    {text:"AI Solutions",color: "text-gray-500",bgColor: "bg-transparent"},
    {text:"Online Marketing",color: "text-gray-500",bgColor: "bg-transparent"},
  ]


  return(
    <>
    <TwoColumn leftContent={<HeroLeft heading={"Fabiel Ramirez"}  pills={pills}/>} rightContent={<HeroRight />}></TwoColumn>
  
    </>
  )

}