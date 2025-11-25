"use client";

export default function IntroPopup({ onClose }: { onClose: () => void }) {
return (
<section className="introPopup">
    <h2>Welcome to Our Scroll Trap project!</h2>
    <p>This project is designed to demonstrate dark pattern techniques and what could be used as better alternatives by social media platforms and web development.</p>
    <p>This project is made by a group of students attending the <a href="https://www.hva.nl/" target="_blank"><b>HVA</b></a>.</p>
    <p>This project is made for <a href="https://www.bitsoffreedom.nl/" target="_blank"><b>Bits of Freedom</b></a>.</p>
    <p>All data that is given is not used for any commercial purposes.</p>
    <p><button type="button" onClick={onClose}>Close</button></p>
</section>
);
};