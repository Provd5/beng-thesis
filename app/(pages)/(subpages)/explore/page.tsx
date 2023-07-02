import { Button, ButtonLink, ButtonWithColor } from "~/components/ui/Buttons";

export default function ExplorePage() {
  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <Button>TEST test Test</Button>
        <Button size="sm">TEST test Test</Button>
        <Button loading>TEST test Test</Button>
        <ButtonLink>TEST test Test</ButtonLink>
        <ButtonLink size="sm">TEST test Test</ButtonLink>
        <ButtonLink loading>TEST test Test</ButtonLink>
        <ButtonWithColor>TEST test Test</ButtonWithColor>
        <ButtonWithColor size="sm">TEST test Test</ButtonWithColor>
        <ButtonWithColor loading>TEST test Test</ButtonWithColor>
      </div>
    </>
  );
}
