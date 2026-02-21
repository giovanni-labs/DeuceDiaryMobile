import { Redirect } from "expo-router";

/** Dummy screen — the Log tab button redirects to the modal */
export default function LogRedirect() {
  return <Redirect href="/modals/log-a-deuce" />;
}
