import React from 'react';
import logo from '../assets/logoTradex.svg';

function Footer() {
    return ( 
       <div className="container mt-5 border-top bg-light">
            <div className="row mt-5 text-center text-md-start">
                <div className="col-md-3 mb-4">
                    <div className="d-flex align-items-center mb-3">
                        <img src={logo} style={{ width: "36px", height: "36px", marginRight: "10px" }} alt="ZenTrade Logo" />
                        <span className="fw-bold fs-4" style={{ color: "#1D4ED8" }}>ZENTRADE</span>
                    </div>
                    <p>&copy; 2010 - 2026, ZenTrade Broking Ltd. All rights reserved.</p>
                </div>
                <div className="col-md-3 mb-4">
                    <p><strong>Company</strong></p>
                    <a href="">About</a><br />
                    <a href="">Products</a><br />
                    <a href="">Pricing</a><br />
                    <a href="">Referral programme</a><br />
                    <a href="">Careers</a><br />
                    <a href="">ZenTrade.tech</a><br />
                    <a href="">Open source</a><br />
                    <a href="">Press & media</a><br />
                    <a href="">ZenTrade Cares (CSR)</a><br />
                </div>
                <div className="col-md-3 mb-4">
                    <p><strong>Support</strong></p>
                    <a href="">Contact us</a><br />
                    <a href="">Support portal</a><br />
                    <a href="">Zen-Connect blog</a><br />
                    <a href="">List of charges</a><br />
                    <a href="">Downloads & resources</a><br />
                    <a href="">Videos</a><br />
                    <a href="">Market overview</a><br />
                    <a href="">How to file a complaint?</a><br />
                    <a href="">Status of your complaints</a><br />
                </div>
                <div className="col-md-3 mb-4">
                    <p><strong>Account</strong></p>
                    <a href="">Open an account</a><br />
                    <a href="">Fund transfer</a>
                </div>
            </div>
            <div className='mt-5 text-small text-muted' style={{ fontSize: "14px" }}>
                <p>ZenTrade Broking Ltd.: Member of NSE, BSE & MCX – SEBI Registration no.: INZ000031633 CDSL/NSDL: Depository services through ZenTrade Broking Ltd. – SEBI Registration no.: IN-DP-431-2019 Commodity Trading through ZenTrade Commodities Pvt. Ltd. MCX: 46025; NSE-50001 – SEBI Registration no.: INZ000038238 Registered Address: ZenTrade Broking Ltd., Financial District, Hyderabad / Bengaluru, India.</p>
                <p>Procedure to file a complaint on SEBI SCORES: Register on SCORES portal. Mandatory details for filing complaints on SCORES: Name, PAN, Address, Mobile Number, E-mail ID.</p>
                <p>Investments in securities market are subject to market risks; read all the related documents carefully before investing.</p>
            </div>
       </div>
    );
}

export default Footer;
