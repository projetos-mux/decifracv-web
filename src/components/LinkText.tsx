import type { JSX } from "react";
import { Link } from "react-router-dom";

type Props = {
  path: string
  text: string
}

export default function LinkText (props: Props): JSX.Element {
  const { path, text } = props

  return <Link to={path} className="text-[#00CC82] hover:underline cursor-pointer">{text}</Link>
}