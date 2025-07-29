import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="checkout-footer">
      <div className="footer-content">
        <p className="footer-text">© 2024 A-Root. All rights reserved.</p>
        <div className="footer-links">
          <a href="#" className="footer-link">利用規約</a>
          <span className="footer-separator">|</span>
          <a href="#" className="footer-link">プライバシーポリシー</a>
          <span className="footer-separator">|</span>
          <a href="#" className="footer-link">サポート</a>
        </div>
      </div>
    </footer>
  )
}