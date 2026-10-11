You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
alert-1.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button-1';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

const alertVariants = cva('flex items-stretch w-full gap-2 group-[.toaster]:w-(--width)', {
  variants: {
    variant: {
      secondary: '',
      primary: '',
      destructive: '',
      success: '',
      info: '',
      mono: '',
      warning: '',
    },
    icon: {
      primary: '',
      destructive: '',
      success: '',
      info: '',
      warning: '',
    },
    appearance: {
      solid: '',
      outline: '',
      light: '',
      stroke: 'text-foreground',
    },
    size: {
      lg: 'rounded-lg p-4 gap-3 text-base [&>[data-slot=alert-icon]>svg]:size-6 *:data-slot=alert-icon:mt-0.5 [&_[data-slot=alert-close]]:mt-1',
      md: 'rounded-lg p-3.5 gap-2.5 text-sm [&>[data-slot=alert-icon]>svg]:size-5 *:data-slot=alert-icon:mt-0 [&_[data-slot=alert-close]]:mt-0.5',
      sm: 'rounded-md px-3 py-2.5 gap-2 text-xs [&>[data-slot=alert-icon]>svg]:size-4 *:data-alert-icon:mt-0.5 [&_[data-slot=alert-close]]:mt-0.25 [&_[data-slot=alert-close]_svg]:size-3.5',
    },
  },
  compoundVariants: [
    /* Solid */
    {
      variant: 'secondary',
      appearance: 'solid',
      className: 'bg-muted text-foreground',
    },
    {
      variant: 'primary',
      appearance: 'solid',
      className: 'bg-primary text-primary-foreground',
    },
    {
      variant: 'destructive',
      appearance: 'solid',
      className: 'bg-destructive text-destructive-foreground',
    },
    {
      variant: 'success',
      appearance: 'solid',
      className:
        'bg-[var(--color-success,var(--color-green-500))] text-[var(--color-success-foreground,var(--color-white))]',
    },
    {
      variant: 'info',
      appearance: 'solid',
      className:
        'bg-[var(--color-info,var(--color-violet-600))] text-[var(--color-info-foreground,var(--color-white))]',
    },
    {
      variant: 'warning',
      appearance: 'solid',
      className:
        'bg-[var(--color-warning,var(--color-yellow-500))] text-[var(--color-warning-foreground,var(--color-white))]',
    },
    {
      variant: 'mono',
      appearance: 'solid',
      className: 'bg-zinc-950 text-white dark:bg-zinc-300 dark:text-black *:data-slot-[alert=close]:text-white',
    },

    /* Outline */
    {
      variant: 'secondary',
      appearance: 'outline',
      className: 'border border-border bg-background text-foreground [&_[data-slot=alert-close]]:text-foreground',
    },
    {
      variant: 'primary',
      appearance: 'outline',
      className: 'border border-border bg-background text-primary [&_[data-slot=alert-close]]:text-foreground',
    },
    {
      variant: 'destructive',
      appearance: 'outline',
      className: 'border border-border bg-background text-destructive [&_[data-slot=alert-close]]:text-foreground',
    },
    {
      variant: 'success',
      appearance: 'outline',
      className:
        'border border-border bg-background text-[var(--color-success,var(--color-green-500))] [&_[data-slot=alert-close]]:text-foreground',
    },
    {
      variant: 'info',
      appearance: 'outline',
      className:
        'border border-border bg-background text-[var(--color-info,var(--color-violet-600))] [&_[data-slot=alert-close]]:text-foreground',
    },
    {
      variant: 'warning',
      appearance: 'outline',
      className:
        'border border-border bg-background text-[var(--color-warning,var(--color-yellow-500))] [&_[data-slot=alert-close]]:text-foreground',
    },
    {
      variant: 'mono',
      appearance: 'outline',
      className: 'border border-border bg-background text-foreground [&_[data-slot=alert-close]]:text-foreground',
    },

    /* Light */
    {
      variant: 'secondary',
      appearance: 'light',
      className: 'bg-muted border border-border text-foreground',
    },
    {
      variant: 'primary',
      appearance: 'light',
      className:
        'text-foreground bg-[var(--color-primary-soft,var(--color-blue-50))] border border-[var(--color-primary-alpha,var(--color-blue-100))] [&_[data-slot=alert-icon]]:text-primary dark:bg-[var(--color-primary-soft,var(--color-blue-950))] dark:border-[var(--color-primary-alpha,var(--color-blue-900))]',
    },
    {
      variant: 'destructive',
      appearance: 'light',
      className:
        'bg-[var(--color-destructive-soft,var(--color-red-50))] border border-[var(--color-destructive-alpha,var(--color-red-100))] text-foreground [&_[data-slot=alert-icon]]:text-destructive dark:bg-[var(--color-destructive-soft,var(--color-red-950))] dark:border-[var(--color-destructive-alpha,var(--color-red-900))] ',
    },
    {
      variant: 'success',
      appearance: 'light',
      className:
        'bg-[var(--color-success-soft,var(--color-green-50))] border border-[var(--color-success-alpha,var(--color-green-200))] text-foreground [&_[data-slot=alert-icon]]:text-[var(--color-success-foreground,var(--color-green-600))] dark:bg-[var(--color-success-soft,var(--color-green-950))] dark:border-[var(--color-success-alpha,var(--color-green-900))]',
    },
    {
      variant: 'info',
      appearance: 'light',
      className:
        'bg-[var(--color-info-soft,var(--color-violet-50))] border border-[var(--color-info-alpha,var(--color-violet-100))] text-foreground [&_[data-slot=alert-icon]]:text-[var(--color-info-foreground,var(--color-violet-600))] dark:bg-[var(--color-info-soft,var(--color-violet-950))] dark:border-[var(--color-info-alpha,var(--color-violet-900))]',
    },
    {
      variant: 'warning',
      appearance: 'light',
      className:
        'bg-[var(--color-warning-soft,var(--color-yellow-50))] border border-[var(--color-warning-alpha,var(--color-yellow-200))] text-foreground [&_[data-slot=alert-icon]]:text-[var(--color-warning-foreground,var(--color-yellow-600))] dark:bg-[var(--color-warning-soft,var(--color-yellow-950))] dark:border-[var(--color-warning-alpha,var(--color-yellow-900))]',
    },

    /* Mono */
    {
      variant: 'mono',
      icon: 'primary',
      className: '[&_[data-slot=alert-icon]]:text-primary',
    },
    {
      variant: 'mono',
      icon: 'warning',
      className: '[&_[data-slot=alert-icon]]:text-[var(--color-warning-foreground,var(--color-yellow-600))]',
    },
    {
      variant: 'mono',
      icon: 'success',
      className: '[&_[data-slot=alert-icon]]:text-[var(--color-success-foreground,var(--color-green-600))]',
    },
    {
      variant: 'mono',
      icon: 'destructive',
      className: '[&_[data-slot=alert-icon]]:text-destructive',
    },
    {
      variant: 'mono',
      icon: 'info',
      className: '[&_[data-slot=alert-icon]]:text-[var(--color-info-foreground,var(--color-violet-600))]',
    },
  ],
  defaultVariants: {
    variant: 'secondary',
    appearance: 'solid',
    size: 'md',
  },
});

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  close?: boolean;
  onClose?: () => void;
}

interface AlertIconProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

function Alert({ className, variant, size, icon, appearance, close = false, onClose, children, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant, size, icon, appearance }), className)}
      {...props}
    >
      {children}
      {close && (
        <Button
          size="sm"
          variant="inverse"
          mode="icon"
          onClick={onClose}
          aria-label="Dismiss"
          data-slot="alert-close"
          className={cn('group shrink-0 size-4')}
        >
          <X className="opacity-60 group-hover:opacity-100 size-4" />
        </Button>
      )}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <div data-slot="alert-title" className={cn('grow tracking-tight', className)} {...props} />;
}

function AlertIcon({ children, className, ...props }: AlertIconProps) {
  return (
    <div data-slot="alert-icon" className={cn('shrink-0', className)} {...props}>
      {children}
    </div>
  );
}

function AlertToolbar({ children, className, ...props }: AlertIconProps) {
  return (
    <div data-slot="alert-toolbar" className={cn(className)} {...props}>
      {children}
    </div>
  );
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('text-sm [&_p]:leading-relaxed [&_p]:mb-2', className)}
      {...props}
    />
  );
}

function AlertContent({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      data-slot="alert-content"
      className={cn('space-y-2 [&_[data-slot=alert-title]]:font-semibold', className)}
      {...props}
    />
  );
}

export { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle, AlertToolbar };



demo.tsx
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert-1';
import { Bell, CircleAlert, CircleCheck, MessageSquareWarning, ShieldAlert, TriangleAlert } from 'lucide-react';

export default function AlertDemo() {
  return (
     <div className="flex flex-col gap-5 p-10 w-full mx-auto max-w-[600px] h-screen justify-center items-center">
      <Alert appearance="light" close={true}>
        <AlertIcon>
          <CircleAlert />
        </AlertIcon>
        <AlertTitle>This is a default alert</AlertTitle>
      </Alert>

      <Alert variant="primary" appearance="light" close={true}>
        <AlertIcon>
          <MessageSquareWarning />
        </AlertIcon>
        <AlertTitle>This is a primary alert</AlertTitle>
      </Alert>

      <Alert variant="success" appearance="light" close={true}>
        <AlertIcon>
          <CircleCheck />
        </AlertIcon>
        <AlertTitle>This is a success alert</AlertTitle>
      </Alert>

      <Alert variant="destructive" appearance="light" close={true}>
        <AlertIcon>
          <TriangleAlert />
        </AlertIcon>
        <AlertTitle>This is a destructive alert</AlertTitle>
      </Alert>

      <Alert variant="info" appearance="light" close={true}>
        <AlertIcon>
          <Bell />
        </AlertIcon>
        <AlertTitle>This is an info alert</AlertTitle>
      </Alert>

      <Alert variant="warning" appearance="light" close={true}>
        <AlertIcon>
          <ShieldAlert />
        </AlertIcon>
        <AlertTitle>This is a warning alert</AlertTitle>
      </Alert>
    </div>
  );
}

```

Copy-paste these files for dependencies:
```tsx
sean0205/button-1
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { Slot as SlotPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'cursor-pointer group whitespace-nowrap focus-visible:outline-hidden inline-flex items-center justify-center has-data-[arrow=true]:justify-between whitespace-nowrap text-sm font-medium ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 data-[state=open]:bg-primary/90',
        mono: 'bg-zinc-950 text-white dark:bg-zinc-300 dark:text-black hover:bg-zinc-950/90 dark:hover:bg-zinc-300/90 data-[state=open]:bg-zinc-950/90 dark:data-[state=open]:bg-zinc-300/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 data-[state=open]:bg-destructive/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 data-[state=open]:bg-secondary/90',
        outline: 'bg-background text-accent-foreground border border-input hover:bg-accent data-[state=open]:bg-accent',
        dashed:
          'text-accent-foreground border border-input border-dashed bg-background hover:bg-accent hover:text-accent-foreground data-[state=open]:text-accent-foreground',
        ghost:
          'text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        dim: 'text-muted-foreground hover:text-foreground data-[state=open]:text-foreground',
        foreground: '',
        inverse: '',
      },
      appearance: {
        default: '',
        ghost: '',
      },
      underline: {
        solid: '',
        dashed: '',
      },
      underlined: {
        solid: '',
        dashed: '',
      },
      size: {
        lg: 'h-10 rounded-md px-4 text-sm gap-1.5 [&_svg:not([class*=size-])]:size-4',
        md: 'h-8.5 rounded-md px-3 gap-1.5 text-[0.8125rem] leading-(--text-sm--line-height) [&_svg:not([class*=size-])]:size-4',
        sm: 'h-7 rounded-md px-2.5 gap-1.25 text-xs [&_svg:not([class*=size-])]:size-3.5',
        icon: 'size-8.5 rounded-md [&_svg:not([class*=size-])]:size-4 shrink-0',
      },
      autoHeight: {
        true: '',
        false: '',
      },
      shape: {
        default: '',
        circle: 'rounded-full',
      },
      mode: {
        default: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        icon: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        link: 'text-primary h-auto p-0 bg-transparent rounded-none hover:bg-transparent data-[state=open]:bg-transparent',
        input: `
            justify-start font-normal hover:bg-background [&_svg]:transition-colors [&_svg]:hover:text-foreground data-[state=open]:bg-background 
            focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/30 
            [[data-state=open]>&]:border-ring [[data-state=open]>&]:outline-hidden [[data-state=open]>&]:ring-[3px] 
            [[data-state=open]>&]:ring-ring/30 
            aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/20
            in-data-[invalid=true]:border-destructive/60 in-data-[invalid=true]:ring-destructive/10  dark:in-data-[invalid=true]:border-destructive dark:in-data-[invalid=true]:ring-destructive/20
          `,
      },
      placeholder: {
        true: 'text-muted-foreground',
        false: '',
      },
    },
    compoundVariants: [
      // Icons opacity for default mode
      {
        variant: 'ghost',
        mode: 'default',
        className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60',
      },
      {
        variant: 'outline',
        mode: 'default',
        className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60',
      },
      {
        variant: 'dashed',
        mode: 'default',
        className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60',
      },
      {
        variant: 'secondary',
        mode: 'default',
        className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60',
      },

      // Icons opacity for default mode
      {
        variant: 'outline',
        mode: 'input',
        className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60',
      },
      {
        variant: 'outline',
        mode: 'icon',
        className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60',
      },

      // Auto height
      {
        size: 'md',
        autoHeight: true,
        className: 'h-auto min-h-8.5',
      },
      {
        size: 'sm',
        autoHeight: true,
        className: 'h-auto min-h-7',
      },
      {
        size: 'lg',
        autoHeight: true,
        className: 'h-auto min-h-10',
      },

      // Shadow support
      {
        variant: 'primary',
        mode: 'default',
        appearance: 'default',
        className: 'shadow-xs shadow-black/5',
      },
      {
        variant: 'mono',
        mode: 'default',
        appearance: 'default',
        className: 'shadow-xs shadow-black/5',
      },
      {
        variant: 'secondary',
        mode: 'default',
        appearance: 'default',
        className: 'shadow-xs shadow-black/5',
      },
      {
        variant: 'outline',
        mode: 'default',
        appearance: 'default',
        className: 'shadow-xs shadow-black/5',
      },
      {
        variant: 'dashed',
        mode: 'default',
        appearance: 'default',
        className: 'shadow-xs shadow-black/5',
      },
      {
        variant: 'destructive',
        mode: 'default',
        appearance: 'default',
        className: 'shadow-xs shadow-black/5',
      },

      // Shadow support
      {
        variant: 'primary',
        mode: 'icon',
        appearance: 'default',
        className: 'shadow-xs shadow-black/5',
      },
      {
        variant: 'mono',
        mode: 'icon',
        appearance: 'default',
        className: 'shadow-xs shadow-black/5',
      },
      {
        variant: 'secondary',
        mode: 'icon',
        appearance: 'default',
        className: 'shadow-xs shadow-black/5',
      },
      {
        variant: 'outline',
        mode: 'icon',
        appearance: 'default',
        className: 'shadow-xs shadow-black/5',
      },
      {
        variant: 'dashed',
        mode: 'icon',
        appearance: 'default',
        className: 'shadow-xs shadow-black/5',
      },
      {
        variant: 'destructive',
        mode: 'icon',
        appearance: 'default',
        className: 'shadow-xs shadow-black/5',
      },

      // Link
      {
        variant: 'primary',
        mode: 'link',
        underline: 'solid',
        className:
          'font-medium text-primary hover:text-primary/90 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-solid',
      },
      {
        variant: 'primary',
        mode: 'link',
        underline: 'dashed',
        className:
          'font-medium text-primary hover:text-primary/90 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-dashed decoration-1',
      },
      {
        variant: 'primary',
        mode: 'link',
        underlined: 'solid',
        className:
          'font-medium text-primary hover:text-primary/90 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-solid',
      },
      {
        variant: 'primary',
        mode: 'link',
        underlined: 'dashed',
        className:
          'font-medium text-primary hover:text-primary/90 [&_svg]:opacity-60 underline underline-offset-4 decoration-dashed decoration-1',
      },

      {
        variant: 'inverse',
        mode: 'link',
        underline: 'solid',
        className:
          'font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-solid',
      },
      {
        variant: 'inverse',
        mode: 'link',
        underline: 'dashed',
        className:
          'font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-dashed decoration-1',
      },
      {
        variant: 'inverse',
        mode: 'link',
        underlined: 'solid',
        className:
          'font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-solid',
      },
      {
        variant: 'inverse',
        mode: 'link',
        underlined: 'dashed',
        className:
          'font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-dashed decoration-1',
      },

      {
        variant: 'foreground',
        mode: 'link',
        underline: 'solid',
        className:
          'font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-solid',
      },
      {
        variant: 'foreground',
        mode: 'link',
        underline: 'dashed',
        className:
          'font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-dashed decoration-1',
      },
      {
        variant: 'foreground',
        mode: 'link',
        underlined: 'solid',
        className:
          'font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-solid',
      },
      {
        variant: 'foreground',
        mode: 'link',
        underlined: 'dashed',
        className:
          'font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-dashed decoration-1',
      },

      // Ghost
      {
        variant: 'primary',
        appearance: 'ghost',
        className: 'bg-transparent text-primary/90 hover:bg-primary/5 data-[state=open]:bg-primary/5',
      },
      {
        variant: 'destructive',
        appearance: 'ghost',
        className: 'bg-transparent text-destructive/90 hover:bg-destructive/5 data-[state=open]:bg-destructive/5',
      },
      {
        variant: 'ghost',
        mode: 'icon',
        className: 'text-muted-foreground',
      },

      // Size
      {
        size: 'sm',
        mode: 'icon',
        className: 'w-7 h-7 p-0 [[&_svg:not([class*=size-])]:size-3.5',
      },
      {
        size: 'md',
        mode: 'icon',
        className: 'w-8.5 h-8.5 p-0 [&_svg:not([class*=size-])]:size-4',
      },
      {
        size: 'icon',
        className: 'w-8.5 h-8.5 p-0 [&_svg:not([class*=size-])]:size-4',
      },
      {
        size: 'lg',
        mode: 'icon',
        className: 'w-10 h-10 p-0 [&_svg:not([class*=size-])]:size-4',
      },

      // Input mode
      {
        mode: 'input',
        placeholder: true,
        variant: 'outline',
        className: 'font-normal text-muted-foreground',
      },
      {
        mode: 'input',
        variant: 'outline',
        size: 'sm',
        className: 'gap-1.25',
      },
      {
        mode: 'input',
        variant: 'outline',
        size: 'md',
        className: 'gap-1.5',
      },
      {
        mode: 'input',
        variant: 'outline',
        size: 'lg',
        className: 'gap-1.5',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      mode: 'default',
      size: 'md',
      shape: 'default',
      appearance: 'default',
    },
  },
);

function Button({
  className,
  selected,
  variant,
  shape,
  appearance,
  mode,
  size,
  autoHeight,
  underlined,
  underline,
  asChild = false,
  placeholder = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    selected?: boolean;
    asChild?: boolean;
  }) {
  const Comp = asChild ? SlotPrimitive.Slot : 'button';
  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({
          variant,
          size,
          shape,
          appearance,
          mode,
          autoHeight,
          placeholder,
          underlined,
          underline,
          className,
        }),
        asChild && props.disabled && 'pointer-events-none opacity-50',
      )}
      {...(selected && { 'data-state': 'open' })}
      {...props}
    />
  );
}

interface ButtonArrowProps extends React.SVGProps<SVGSVGElement> {
  icon?: LucideIcon; // Allows passing any Lucide icon
}

function ButtonArrow({ icon: Icon = ChevronDown, className, ...props }: ButtonArrowProps) {
  return <Icon data-slot="button-arrow" className={cn('ms-auto -me-1', className)} {...props} />;
}

export { Button, ButtonArrow, buttonVariants };

```

Install NPM dependencies:
```bash
lucide-react, class-variance-authority, radix-ui
```

Extend existing Tailwind 4 index.css with this code (or if project uses Tailwind 3, extend tailwind.config.js or globals.css):
```css
@import "tailwindcss";
@import "tw-animate-css";

@theme inline {
  --color-destructive-foreground: var(--destructive-foreground);
}

:root {
  --destructive-foreground: oklch(1 0 0);
}

.dark {
  --destructive-foreground: oklch(1 0 0);
}

```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them