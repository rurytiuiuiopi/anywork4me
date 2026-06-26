import { ProfileClient } from "./ProfileClient";

export default async function ProviderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfileClient id={id} />;
}
