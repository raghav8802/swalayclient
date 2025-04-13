import * as React from "react"
import { ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Slot } from "@radix-ui/react-slot"
import PropTypes from "prop-types"

import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"
Breadcrumb.propTypes = {
  separator: PropTypes.node,
  className: PropTypes.string,
}

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"
BreadcrumbList.propTypes = {
<<<<<<< HEAD
  className: PropTypes.string
=======
  className: PropTypes.string,
>>>>>>> 445477dd48587fbdc5eabefe39f1cea0141a708a
}

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"
BreadcrumbItem.propTypes = {
<<<<<<< HEAD
  className: PropTypes.string
=======
  className: PropTypes.string,
>>>>>>> 445477dd48587fbdc5eabefe39f1cea0141a708a
}

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"
BreadcrumbLink.propTypes = {
<<<<<<< HEAD
  className: PropTypes.string,
  asChild: PropTypes.bool
=======
  asChild: PropTypes.bool,
  className: PropTypes.string,
>>>>>>> 445477dd48587fbdc5eabefe39f1cea0141a708a
}

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"
BreadcrumbPage.propTypes = {
<<<<<<< HEAD
  className: PropTypes.string
=======
  className: PropTypes.string,
>>>>>>> 445477dd48587fbdc5eabefe39f1cea0141a708a
}

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRightIcon />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"
BreadcrumbSeparator.propTypes = {
<<<<<<< HEAD
  className: PropTypes.string,
  children: PropTypes.node
=======
  children: PropTypes.node,
  className: PropTypes.string,
>>>>>>> 445477dd48587fbdc5eabefe39f1cea0141a708a
}

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <DotsHorizontalIcon className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"
BreadcrumbEllipsis.propTypes = {
<<<<<<< HEAD
  className: PropTypes.string
=======
  className: PropTypes.string,
>>>>>>> 445477dd48587fbdc5eabefe39f1cea0141a708a
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
