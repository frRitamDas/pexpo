import { getSongsById } from "@/lib/fetch";
import { cleanMusicText } from "@/lib/text";
import Player from "../_components/Player";
import Recomandation from "../_components/Recomandation";

export const generateMetadata = async ({ params }) => {
  const response = await getSongsById(params.id);
  const data = await response.json();
  const song = data?.data?.[0];
  const title = cleanMusicText(song?.name || "PEXPO");
  const artist = cleanMusicText(song?.artists?.primary?.[0]?.name || "unknown");
  const image = song?.image?.[2]?.url || song?.image?.[1]?.url || song?.image?.[0]?.url;
  return {
    title,
    description: `Listen to "${title}" by ${artist} on PEXPO.`,
    openGraph: { title, description: `Listen to "${title}" by ${artist} on PEXPO.`, type: "music.song", url: song?.url, images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : [] },
    twitter: { card: "summary_large_image", title, description: `Listen to "${title}" by ${artist} on PEXPO.`, images: image ? [image] : [] },
  };
};

export default function Page({ params }) {
  return <div className="pb-20"><Player id={params.id} /><Recomandation id={params.id} /></div>;
}
