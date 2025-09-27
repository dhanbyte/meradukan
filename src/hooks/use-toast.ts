import { useEffect, useState, useReducer } from "react"

// Simple class name combiner function
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
}

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000;

type ToastType = "default" | "destructive"

type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  type?: ToastType
  duration?: number
}

type ToasterToast = Omit<Toast, "id"> & {
  id?: string
  className?: string
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type ToastState = {
  toasts: Toast[]
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let memoryState: ToastState = { toasts: [] }

const listeners: Array<(state: ToastState) => void> = []

const toast = ({ variant, className, ...props }: ToasterToast) => {
  const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // Map variant to appropriate classes
  const variantClasses = {
    default: "bg-white text-slate-950",
    destructive: "bg-red-500 text-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white"
  };

  const toastClass = cn(
    variant ? variantClasses[variant] : variantClasses.default,
    className
  );

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      className: toastClass,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
};

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast> & { id: string };
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: Toast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: Toast["id"];
    };


const reducer = (state: ToastState, action: Action): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.toast as Toast].slice(0, TOAST_LIMIT),
      }
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        setTimeout(() => {
          dispatch({ type: "REMOVE_TOAST", toastId });
        }, TOAST_REMOVE_DELAY);
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
}

const dispatch = (action: Action) => {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function useToast() {
  const [state, setState] = useState(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  // Auto-dismiss logic
  useEffect(() => {
    const { toasts } = state;
    if (toasts.length > 0) {
      const lastToast = toasts[0];
      const timer = setTimeout(() => {
        dispatch({ type: "DISMISS_TOAST", toastId: lastToast.id });
      }, lastToast.duration || 1000); // Default to 1 second
      return () => clearTimeout(timer);
    }
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
