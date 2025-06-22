import { PillsProps } from "../../atoms/pills/pills";
import TwoColumn from "../../layout/twocolumns";   
import HeroLeft from "../../molecules/sections/hero_left"
import HeroRight from "../../molecules/sections/hero_right";

export default function Hero() {
    return(
    <div className="px-2 md:px-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <TwoColumn 
        leftContent={<HeroLeft heading={"Fabiel Ramirez"} />} 
        rightContent={<HeroRight />}
      />
    </div>
  )
}