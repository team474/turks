import clsx from "clsx";
import Image from "next/image";
// import Label from "../label";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  containerClassName,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
  containerClassName?: string;
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        "group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white/80 hover:border-green-600 dark:bg-black/80 backdrop-blur-sm ",
        {
          relative: label,
          "border-2 border-green-600": active,
          "border-neutral-200 dark:border-neutral-800": !active,
        },
        containerClassName,
      )}
    >
      {props.src ? (
        <Image
          className={clsx("relative h-full w-full object-contain", {
            "transition duration-300 ease-in-out group-hover:scale-105":
              isInteractive,
          })}
          {...props}
        />
      ) : null}
      {/* {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null} */}
    </div>
  );
}
