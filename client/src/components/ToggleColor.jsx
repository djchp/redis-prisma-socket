import { Button } from "@chakra-ui/react"
import {SunIcon, MoonIcon} from '@chakra-ui/icons'
import {useColorMode} from '@chakra-ui/color-mode'

const ToggleColor = () => {
    const {colorMode, toggleColorMode} = useColorMode()

  return (
    <Button onClick={() => toggleColorMode()} pos="absolute" top="0" right="0" m="1rem">
        {colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

export default ToggleColor