import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Twitter,
  Disc,
  Instagram,
  X,
  Send,
  CheckCircle2 } from
'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { toast } from 'sonner';
export function Footer() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const handleContactSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setContactSubmitted(true);
    toast.success('Message sent successfully!');
  };
  const handleHelpCenter = () => {
    // Trigger chat center open - dispatch custom event
    window.dispatchEvent(new CustomEvent('openChatCenter'));
    toast.info('Opening Help Center...');
  };
  const resetContactForm = () => {
    setContactForm({
      name: '',
      email: '',
      message: ''
    });
    setContactSubmitted(false);
    setIsContactModalOpen(false);
  };
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emperial-400 to-emperial-600">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-white">Emperial</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Professional boosting services for competitive gamers. Reach your
              dream rank with speed, safety, and security.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors">
                
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors">
                
                <Disc className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors">
                
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-emperial-400 transition-colors">
                  
                  World of Warcraft
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-emperial-400 transition-colors">
                  
                  League of Legends
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-emperial-400 transition-colors">
                  
                  Valorant
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-emperial-400 transition-colors">
                  
                  Apex Legends
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-emperial-400 transition-colors">
                  
                  Coaching
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="#"
                  className="hover:text-emperial-400 transition-colors">
                  
                  About Us
                </a>
              </li>
              <li>
                <Link
                  to="/provider/login"
                  className="hover:text-emperial-400 transition-colors">
                  
                  Work with Us
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emperial-400 transition-colors">
                  
                  Reviews
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emperial-400 transition-colors">
                  
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={handleHelpCenter}
                  className="hover:text-emperial-400 transition-colors">
                  
                  Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="hover:text-emperial-400 transition-colors">
                  
                  Contact Us
                </button>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-emperial-400 transition-colors">
                  
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-emperial-400 transition-colors">
                  
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="hover:text-emperial-400 transition-colors">
                  
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 Emperial Boosting. All rights reserved. Not affiliated with
            Riot Games, Valve, or EA.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            All Systems Operational
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={resetContactForm}
        title="Contact Us">
        
        <AnimatePresence mode="wait">
          {!contactSubmitted ?
          <motion.div
            key="form"
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            className="space-y-4">
            
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Name
                </label>
                <input
                type="text"
                value={contactForm.name}
                onChange={(e) =>
                setContactForm({
                  ...contactForm,
                  name: e.target.value
                })
                }
                placeholder="Your name"
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500" />
              
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Email
                </label>
                <input
                type="email"
                value={contactForm.email}
                onChange={(e) =>
                setContactForm({
                  ...contactForm,
                  email: e.target.value
                })
                }
                placeholder="your@email.com"
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500" />
              
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Message
                </label>
                <textarea
                value={contactForm.message}
                onChange={(e) =>
                setContactForm({
                  ...contactForm,
                  message: e.target.value
                })
                }
                placeholder="How can we help you?"
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500 h-32 resize-none" />
              
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                variant="secondary"
                className="flex-1"
                onClick={resetContactForm}>
                
                  Cancel
                </Button>
                <Button
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleContactSubmit}>
                
                  <Send className="w-4 h-4" /> Send Message
                </Button>
              </div>
            </motion.div> :

          <motion.div
            key="success"
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            className="text-center py-8">
            
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Message Sent!
              </h3>
              <p className="text-slate-400 mb-6">
                We'll get back to you within 24 hours.
              </p>
              <Button onClick={resetContactForm}>Close</Button>
            </motion.div>
          }
        </AnimatePresence>
      </Modal>
    </footer>);

}