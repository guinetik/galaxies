J/AJ/160/271   A catalog of ~30000 galaxies with ALFALFA-SDSS   (Durbala+, 2020)
================================================================================
The ALFALFA-SDSS galaxy catalog.
    Durbala A., Finn R.A., Odekon M.C., Haynes M.P., Koopmann R.A.,
    O'Donoghue A.A.
   <Astron. J., 160, 271 (2020)>
   =2020AJ....160..271D
================================================================================
ADC_Keywords: Galaxies; Photometry, RI; Photometry, G band; Extinction; Colors
Keywords: Galaxies ; Late-type galaxies ; Galaxy evolution ; Sky surveys ;
          Astronomy databases

Abstract:
    We present a HI optical catalog of ~30000 galaxies based on the 100%
    complete Arecibo Legacy Fast Arecibo L-band Feed Array (ALFALFA)
    survey combined with data from the Sloan Digital Sky Survey (SDSS).
    Our goal is to facilitate the public use of the completed ALFALFA
    catalog by providing carefully determined matches to SDSS
    counterparts, including matches for ~10000 galaxies that do not have
    SDSS spectra. These identifications can provide a basis for further
    crossmatching with other surveys using SDSS photometric IDs as a
    reference point. We derive absolute magnitudes and stellar masses for
    each galaxy using optical colors combined with an internal reddening
    correction designed for small- and intermediate-mass galaxies with
    active star formation. We also provide measures of stellar masses and
    star formation rates based on infrared and/or ultraviolet photometry
    for galaxies that are detected by the Wide-field Infrared Survey
    Explorer and/or the Galaxy Evolution Explorer. Finally, we compare the
    galaxy population in the ALFALFA-SDSS sample with the populations in
    several other publicly available galaxy catalogs and confirm that
    ALFALFA galaxies typically have lower masses and bluer colors.

Description:
    The Arecibo Legacy Fast Arecibo L-band Feed Array (ALFALFA) survey
    provides HI 21cm line measurements for ~31500 galaxies over nearly
    7000deg^2^ on the sky, out to a redshift of about 0.06.

    Exploiting the large collecting area of the Arecibo 305m antenna and
    the seven-beam ALFA radio camera, ALFALFA mapped ~6600deg^2^ of high
    galactic latitude sky in spectral line mode, covering a 100MHz
    bandwidth corresponding to 2000<cz<18000km/ sampled as 4096 spectral
    channels, yielding a resolution of 5.5km/s at z~0 before smoothing.

    Following the recommendations on the SDSS website, we use SDSS cmodel
    mags to calculate galaxy absolute magnitudes and model mags for
    colors.

File Summary:
--------------------------------------------------------------------------------
 FileName    Lrecl  Records  Explanations
--------------------------------------------------------------------------------
ReadMe          80        .  This file
table1.dat     103    31501  Basic optical properties of cross-listed objects
                              in the  ALFALFA-SDSS catalog
table2.dat     122    31501  Derived properties of cross-listed objects in the
                              ALFALFA-SDSS catalog
--------------------------------------------------------------------------------

See also:
 II/363          : The band-merged unWISE Catalog (Schlafly+, 2019)
 VIII/65         : 1.4GHz NRAO VLA Sky Survey (NVSS) (Condon+ 1998)
 VIII/77         : HI spectral properties of galaxies (Springob+, 2005)
 J/AJ/133/2569   : Arecibo legacy fast ALFA survey III. (Giovanelli+, 2007)
 J/AJ/136/713    : Arecibo legacy fast ALFA survey. VI. (Kent+, 2008)
 J/ApJ/692/556   : Star forming galaxy templates (Rieke+, 2009)
 J/AJ/139/2130   : ALFA-ZOA precursor observation (Henning+, 2010)
 J/PASP/122/1397 : Spitzer Survey of Stellar Structure in Galaxies (Sheth+,2010)
 J/AJ/142/170    : ALFALFA survey: {alpha}.40 HI source catalog (Haynes+, 2011)
 J/A+A/553/A91   : Halpha3 survey of Virgo and Coma galaxies (Fossati+, 2013)
 J/ApJ/771/59    : Surface brightness S4G face-on galaxies (Munoz-Mateos+, 2013)
 J/ApJ/842/133   : HI-bearing ultra-diffuse ALFALFA galaxies (Leisman+, 2017)
 J/ApJ/861/49    : ALFALFA extragalactic HI source catalog (Haynes+, 2018)
 http://www.sdss.org/ : SDSS website

Byte-by-byte Description of file: table1.dat
--------------------------------------------------------------------------------
  Bytes Format Units   Label Explanations
--------------------------------------------------------------------------------
  1-  6 I6     ---     AGC   [1/749512] AGC catalog identifier
  8-  8 I1     ---     Flag  [0/3] Photometry flag (1)
 10- 29 I20    ---     ObjID Optical counterpart SDSS DR15 object identifier
 31- 40 F10.6  deg     RAdeg [0.003/360] Right Ascension (J2000) (2)
 42- 49 F8.5   deg     DEdeg [-0.21/36.4] Declination (J2000) (2)
 51- 55 I5     km/s    RVel  [-430/17823] HI profile midpoint heliocentric
                              radial velocity
 57- 61 F5.1   Mpc     Dist  [0.3/260] Distance from Haynes+, 2018, J/ApJ/861/49
 63- 66 F4.1   Mpc   e_Dist  [0/30.9] Uncertainty in Dist
 68- 71 F4.2   mag     gext  [0.02/4.44]? Foreground Galactic extinction in
                               SDSS g band (3)
 73- 76 F4.2   mag     iext  [0.01/2.28]? Foreground Galactic extinction in
                               SDSS i band (3)
 78- 81 F4.2   ---     b/a   [0.05/1]? Axial ratio b/a from SDSS r band
 83- 88 F6.2   ---   e_b/a   [0.01/865]? Uncertainty in b/a (4)
 90- 94 F5.2   mag     imag  [9.58/30.89]? SDSS i band cmodel magnitude
 96-103 F8.2   mag   e_imag  [0.01/42134.68]? Uncertainty in imag (4)
--------------------------------------------------------------------------------
Note (1): Flags as follows:
    0 = outside the SDSS footprint (1296 occurrences)
    1 = SDSS photometry with uncertainties less than 0.05 in g and
        i (good photometry, 28267 occurrences)
    2 = SDSS photometry with uncertainties greater than 0.05 in g and/or
        i (bad photometry, 1371 occurrences)
    3 = no SDSS counterpart identified, despite being within the SDSS footprint
        (567 occurrences)
Note (2): Of the optical counterpart or HI centroid, if no optical
          counterpart has been identified.
Note (3): As described in section 2.2.
Note (4): We are aware of extremely large errors in a few cases for b/a
          and cmodel magnitudes, but these are the errors reported by
          the SDSS pipeline.
--------------------------------------------------------------------------------

Byte-by-byte Description of file: table2.dat
--------------------------------------------------------------------------------
  Bytes Format Units          Label   Explanations
--------------------------------------------------------------------------------
  1-  6 I6     ---            AGC      [1/749512] AGC catalog identifier
  8- 11 F4.2   mag            Ag       [0/1.91]? g band internal extinction
                                        factor (1)
 13- 16 F4.2   mag            Ai       [0/0.99]? i band internal extinction
                                        factor (1)
 18- 23 F6.2   mag            iMAG     [-24/-10]? Corrected absolute i band
                                        magnitude (2)
 25- 29 F5.2   mag          e_iMAG     [0.02/86]? Uncertainty in iMAG
 31- 35 F5.2   mag            g-i      [-1.97/3.8]? Corrected (g-i) color (2)
 37- 42 F6.2   mag          e_g-i      [0.03/220.3]? Uncertainty in g-i
 44- 48 F5.2   [solMass]      logMsT   [4.49/12.45]? log Taylor method stellar
                                        mass (3)
 50- 55 F6.2   [solMass]    e_logMsT   [0.02/158]? Uncertainty in logMsT
 57- 61 F5.2   [solMass]      logMsM   [4.4/11.94]? log McGaugh method stellar
                                        mass (3)
 63- 66 F4.2   [solMass]    e_logMsM   [0.01/1.66]? Uncertainty in logMsM
 68- 72 F5.2   [solMass]      logMsG   [7.37/11.69]? log GSWLC-2 derived stellar
                                        mass
 74- 77 F4.2   [solMass]    e_logMsG   [0/0.25]? Uncertainty in logMsG
 79- 83 F5.2   [solMass/yr]   logSFR22 [-5.57/2.17]? log Star Formatation Rate
                                       from 22{mu}m unWISE photometry (4)
 85- 88 F4.2   [solMass/yr] e_logSFR22 [0.01/3.6]? Uncertainty in logSFR22
 90- 94 F5.2   [solMass/yr]   logSFRN  [-3.53/7.88]? log Star Formatation Rate
                                        from GALEX NUV photometry (4)
 96-100 F5.2   [solMass/yr] e_logSFRN  [0.02/28.03]? Uncertainty in logSFRN
102-106 F5.2   [solMass/yr]   logSFRG  [-2.94/1.47]? log Star Formatation Rate
                                        from GSWLC-2
108-111 F4.2   [solMass/yr] e_logSFRG  [0.0/1.08]? Uncertainty in logSFRG
113-117 F5.2   [solMass]      logMHI   [3.76/10.94] Haynes+, 2018, J/ApJ/861/49
                                        log HI mass
119-122 F4.2   [solMass]    e_logMHI   [0.0/1.12] Uncertainty in logMHI
--------------------------------------------------------------------------------
Note (1): As described in Section 2.2.
Note (2): Using SDSS cmodel magnitudes corrected for galactic and internal
          extinction, as described in Section 2.2.
Note (3): As described in Sections 2.3 (Taylor method) and 3.1 (McGaugh method).
Note (4): As described in Section 3.2.
--------------------------------------------------------------------------------

History:
    From electronic version of the journal

================================================================================
(End)                          Prepared by [AAS], Coralie Fix [CDS], 15-Feb-2021
