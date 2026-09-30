import { permanentRedirect } from "next/navigation";

export default function OrbioRedirectPage() {
  permanentRedirect("/data/peaks");
}
