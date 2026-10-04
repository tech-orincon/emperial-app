import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * El muelle vale para entrar, pero al salir rebota: la opacidad cruza el 0 y
 * vuelve a subir, así que el modal reaparece un instante antes de irse. La
 * salida va con un tween corto, y el fondo usa el mismo para que desaparezcan
 * a la vez.
 */
/**
 * El panel se va PRIMERO y el velo oscuro después.
 *
 * Con los dos a la misma velocidad, a mitad del cierre el velo ya no separaba
 * y el panel medio transparente quedaba superpuesto sobre la tarjeta del
 * sidebar: se veían a la vez los emblemas del modal y los de la tarjeta, una
 * doble exposición que se percibe como parpadeo. Verificado en grabación a
 * 60fps: el fantasma duraba ~3 fotogramas.
 */
const PANEL_EXIT = { duration: 0.09, ease: 'easeIn' } as const;
const BACKDROP_EXIT = { duration: 0.2, delay: 0.05, ease: 'easeOut' } as const;

/**
 * El fondo NO lleva `backdrop-filter`, a propósito.
 *
 * Estrenar una capa de backdrop-filter obliga al navegador a rehacer el
 * backdrop root, y todo lo que queda debajo con backdrop-filter se vuelve a
 * rasterizar — durante ese fotograma se pinta transparente. Con `GlassCard`
 * (backdrop-blur-xl) y el navbar debajo, el efecto era que la tarjeta del
 * sidebar desaparecía un instante al abrir el modal.
 *
 * El tinte al 70% oscurece de sobra sin crear esa capa.
 */
const BACKDROP_TRANSITION = { duration: 0.18, ease: 'easeOut' } as const;
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Barra de acciones fija al pie; no scrollea con el contenido */
  footer?: React.ReactNode;
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer
}: ModalProps) {
  // `onClose` suele llegar como flecha nueva en cada render. Si estuviera en las
  // dependencias, el efecto se desmontaría y remontaría constantemente, soltando
  // y volviendo a poner el bloqueo de scroll — de ahí el parpadeo.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleEscape);

    // Al ocultar el scroll desaparece la barra y la página se ensancha. Se
    // compensa con padding para que no salte el contenido de debajo.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    lockScroll(scrollbar);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      unlockScroll();
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-5xl'
  };
  // Se monta en <body>: un ancestro con transform (los motion.div de framer)
  // convierte `position: fixed` en relativo a él y encierra el modal.
  return createPortal(
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0,
            transition: BACKDROP_EXIT
          }}
          transition={BACKDROP_TRANSITION}
          className="fixed inset-0 bg-black/70 z-50"
          onClick={onClose} />
        
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              // Sin `y`: deslizar al salir alarga la sensación de cierre
              transition: PANEL_EXIT
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            className={`w-full ${sizeClasses[size]} max-h-[calc(100dvh-2rem)] flex flex-col bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden`}
            onClick={(e) => e.stopPropagation()}>
            
              {title &&
            <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                
                    <X className="w-4 h-4" />
                  </button>
                </div>
            }
              <div className="p-6 grow min-h-0 overflow-y-auto custom-scrollbar">{children}</div>

              {footer &&
            <div className="shrink-0 p-4 border-t border-white/10 bg-slate-900">
                  {footer}
                </div>
            }
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>,
    document.body);

}

/**
 * Contador de bloqueos: con varios modales montados a la vez (el selector de
 * ligas monta el de origen y el de destino), el que se cierra no debe liberar
 * el scroll que mantiene el que sigue abierto.
 */
let lockCount = 0;

function lockScroll(scrollbarWidth: number) {
  if (lockCount === 0) {
    document.documentElement.style.setProperty('--scrollbar-w', `${scrollbarWidth}px`);
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
}

function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    document.documentElement.style.removeProperty('--scrollbar-w');
  }
}
