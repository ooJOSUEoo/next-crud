import { spec } from "../../../libs/swagger"
import React_swagger from "./react-swagger"


export default function DocPages() {

  return (
    <section>
      <React_swagger spec={spec} />
    </section>
  )
}
