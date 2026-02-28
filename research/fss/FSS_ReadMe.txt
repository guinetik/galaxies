J/other/Ap/52.40    FSS galaxies in southern hemisphere        (Hakobyan+, 2009)
================================================================================
Five supernova survey galaxies in the southern hemisphere.
I. Optical and near-infrared database.
    Hakobyan A.A., Petrosian A.R., Mamon G.A., McLean B., Kunth D., Turatto M.,
    Cappellaro E., Mannucci F., Allen R.J., Panagia N., Della Valle M.
   <Astrophysics, 52, 40-53 (2009)>
   =2009Ap.....52...40H
================================================================================
ADC_Keywords: Supernovae ; Galaxies, IR ; Galaxies, optical
Keywords: supernovae - host galaxies - near-infrared magnitudes

Abstract:
    We describe the properties of the 3838 galaxies that were monitored
    for SNe events, including newly determined morphologies and their
    DENIS and POSS-II/UKST I, 2MASS and DENIS J and K_s_ and 2MASS H
    magnitudes. We have compared 2MASS, DENIS and POSS-II/UKST IJK
    magnitudes in order to find possible systematic photometric shifts in
    the measurements. The DENIS and POSS-II/UKST I band magnitudes show
    large discrepancies (mean absolute difference of 0.4mag), mostly due
    to different spectral responses of the two instruments, with an
    important contribution (0.33mag rms) from the large uncertainties in
    the photometric calibration of the POSS-II and UKST photographic
    plates. In the other wavebands, the limiting near infrared magnitude,
    morphology, and inclination of the galaxies are the most influential
    factors which affect the determination of photometry of the galaxies.
    Nevertheless, no significant systematic differences have been found
    between of any pair of NIR magnitude measurements, except for a few
    percent of galaxies showing large discrepancies. This allows us to
    combine DENIS and 2MASS data for the J and K_s_ filters.

Description:
    The database for 3838 galaxies that were monitored for SNe events
    includes newly determined morphologies and newly measured apparent
    blue and red magnitudes, angular diameters, axial ratios and position
    angles, Two Micron All Sky Survey (2MASS) J, H and K_s_ and Deep
    Near-Infrared Southern Sky Survey (DENIS) I, J and K_s_ magnitudes, as
    well as activity classes from the NASA/IPAC Extragalactic Database
    (NED), and numbers of neighboring objects in a circle of radius 50kpc.
    The optical parameters (morphologies and axial ratios) for the Five SN
    survey (FSS) galaxies were extracted as follows: 10'x10' regions
    centered on each FSS galaxy were extracted from the POSS-II IIIa-J and
    IIIa-F plates and from the UKST IIIa-J and IIIa-F plates. The creation
    of this homogeneous database is aimed to support all future studies
    and to minimize possible selection effects and errors which often
    arise when information are selected from different sources and
    catalogues.

File Summary:
--------------------------------------------------------------------------------
 FileName  Lrecl  Records   Explanations
--------------------------------------------------------------------------------
ReadMe        80        .   This file
fss.dat      204     3838   Optical and near-infrared database of FSS galaxies
--------------------------------------------------------------------------------

See also:
    VII/237 : HYPERLEDA. I. Catalog of galaxies (Paturel+, 2003)
     II/246 : 2MASS All-Sky Catalog of Point Sources (Cutri+ 2003)
    B/denis : The DENIS database (DENIS Consortium, 2005)

Byte-by-byte Description of file: fss.dat
--------------------------------------------------------------------------------
   Bytes Format Units   Label   Explanations
--------------------------------------------------------------------------------
   1-  5  I5    ---     PGC     [12,73176] PGC number (Cat. VII/237)
   7-  8  I2    h       RAh     [0,24[ Hour of Right Ascension (J2000.0)
  10- 11  I2    min     RAm     [0,60[ Minute of Right Ascension (J2000.0)
  13- 16  F4.1  s       RAs     [0,60[ Second of Right Ascension (J2000.0)
      18  A1    ---     DE-     [-+] Sign of the Declination (J2000.0)
  19- 20  I2    deg     DEd     [-90,90] Degree of Declination (J2000.0)
  22- 23  I2    arcmin  DEm     [0,60[ Arcminute of Declination (J2000.0)
  25- 26  I2    arcsec  DEs     [0,60[ Arcsecond of Declination (J2000.0)
  28- 32  I5    km/s    HRV     ? Heliocentric radial velocity (1)
  34- 38  F5.2  mag     Umag    ? U magnitude (2)
  40- 44  F5.2  mag     Bmag    ? B magnitude (3)
  46- 50  F5.2  mag     Rmag    ? R magnitude (4)
  52- 56  F5.2  mag     Imag    ? I magnitude (5)
  58- 62  F5.2  mag     Jmag    ? J magnitude (6)
  64- 68  F5.2  mag     Hmag    ? H magnitude (7)
  70- 74  F5.2  mag     Kmag    ? K magnitude (8)
  76- 79  A4    ---     MType   Morphological type (9)
  81- 83  I3    arcsec  D       ? Major isophotal diameter (10)
  85- 88  F4.2  ---     b/a     [0,1]? Axial ratio (11)
      90  I1    ---     Ng      [0,6]? Counts of neighboring galaxies (12)
  92- 94  I3    deg     PA      [0,180]? Position angle of major axis (13)
  96-128  A33   ---     AC      Activity class (14)
 130-204  A75   ---     Notes   Additional notes (15)
--------------------------------------------------------------------------------
Note (1): The mean heliocentric radial velocity extracted from the
     NASA/IPAC Extragalactic Database.
Note (2): The U magnitudes extracted from the NASA/IPAC Extragalactic
     Database (NED).
Note (3): The blue apparent magnitudes of the galaxies were homogeneously
     measured on Palomar Observatory Schmidt blue plates (POSS-II) for the
     northern hemisphere and on UK Schmidt (UKST) blue plates for the
     southern hemisphere, for the approximately 25.3mag/arcsec^2^ isophotal
     level corresponding to roughly 3 times the background rms noise. All
     plates used in our analysis have been digitized at STScI using the
     modified PDS microdensitometer with a pixel size of 15{mu}m (1.0").
Note (4): The red apparent magnitudes of the galaxies were homogeneously
     measured on Palomar Observatory Schmidt red plates (POSS-II) for the
     northern hemisphere and on UK Schmidt (UKST) red plates for the
     southern hemisphere, at the approximately 25.3mag/arcsec^2^ isophotal
     level corresponding to roughly 3 times the background rms noise. All
     plates used in our analysis have been digitized at STScI using the
     modified PDS microdensitometer with a pixel size of 15{mu}m (1.0").
Note (5): The I magnitudes (extracted using the SExtractor software). In
     this extraction, DENIS detections with SExtractor object flags between
     0 and 3 were considered. DENIS cross-identification is accepted when
     there is only one candidate within a distance of r=10" from each
     galaxy and when the agreement between coordinates is better than 5".
     Since the photographic POSS-II and UKST surveys were also carried out
     in the I band (IV-N emulsion), using the RG9 filter for POSS-II and
     the RG715 filter for UKST, we also used these data for comparison with
     DENIS I band observations.
Note (6): The J magnitudes (extracted using the SExtractor software for
     DENIS magnitudes). In this extraction, DENIS detections with
     SExtractor object flags between 0 and 3 were considered. 2MASS and
     DENIS cross-identifications are accepted when there is only one
     candidate within a distance of r=10" from each galaxy and when the
     agreement between coordinates is better than 5". It includes only
     2MASS detections with confusion ([jhk]_flg) flags 0, 1 and 2 and
     contamination/confusion (cc_flg) flags of 0 or Z.
Note (7): The H magnitudes (extracted using the SExtractor software for
     DENIS magnitudes). In this extraction, DENIS detections with
     SExtractor object flags between 0 and 3 were considered. DENIS
     cross-identification is accepted when there is only one candidate
     within a distance of r=10" from each galaxy and when the agreement
     between coordinates is better than 5".
Note (8): The K magnitudes (extracted using the SExtractor software for
     DENIS magnitudes). In this extraction, DENIS detections with
     SExtractor object flags between 0 and 3 were considered. 2MASS and
     DENIS cross-identifications are accepted when there is only one
     candidate within a distance of r=10" from each galaxy and when the
     agreement between coordinates is better than 5". It includes only
     2MASS detections with confusion ([jhk]_flg) flags 0, 1 and 2 and
     contamination/confusion (cc_flg) flags of 0 or Z.
Note (9): The galaxies morphologies were determined from the blue and red
     images on the POSS-II plates for the northern hemisphere and on the
     UKST plates for the southern hemisphere. All plates used in our
     analysis have been digitized at STScI using the modified PDS
     microdensitometer with a pixel size of 15{mu}m (1.0").
Note (10): The galaxies major isophotal diameters were determined from the
     blue and red images on the POSS-II plates for the northern hemisphere
     and on the UKST plates for the southern hemisphere. All plates used in
     our analysis have been digitized at STScI using the modified PDS
     microdensitometer with a pixel size of 15{mu}m (1."0). The object
     major isophotal diameters were homogeneously measured on these plates
     at the approximately 25.3mag/arcsec^2^ isophotal level in both
     wavebands, corresponding to roughly 3 times the background rms noise.
Note (11): The object axial ratios were determined from blue and red images
     on the POSS-II plates for the northern hemisphere and on the UKST
     plates for the southern hemisphere. All plates used in our analysis
     have been digitized at STScI using the modified PDS microdensitometer
     with a pixel size of 15{mu}m (1.0"). The object axial ratios were
     homogeneously measured on these plates at the approximately
     25.3mag/arcsec^2^ isophotal level in both wavebands, corresponding to
     roughly 3 times the background rms noise.
Note (12): Counts of neighboring galaxies were done for all FSS galaxies
     with known redshifts by projecting a circle of 50kpc radius on a
     10'x10' digitized field of each galaxy. All galaxies detected within
     this circle were counted if their angular sizes differed from that of
     the sample galaxy by no more than factor of 2. Because of several
     technical difficulties and uncertainties (extremely large angular
     field size, etc.) the counts of neighboring galaxies were only
     determined for galaxies with redshifts greater than 0.005.
Note (13): The position angles (PA) of the major axes of the galaxies were
     determined from blue and red images on POSS-II for the northern
     hemisphere and on the UKST plates for the southern hemisphere. All
     plates used in our analysis have been digitized at STScI using the
     modified PDS microdensitometer with a pixel size of 15{mu}m (1.0").
     The object position angles were homogeneously measured on these plates
     at the approximately 25.3mag/arcsec^2^ isophotal level in both
     wavebands, corresponding to roughly 3 times the background rms noise.
Note (14): The selection of active or star-forming (A/SF) galaxies among
     sample objects have been made by crosschecking this sample with the
     all known possible sources of active or star-forming galaxies. The
     cross-checking analysis includes well known optical surveys of A/SF
     galaxies, e.g., Markarian, Kiso, and others, as well as radio surveys,
     which cover the DENIS survey area. Cross-checking also includes the
     lists of known peculiar morphological structure galaxies (e.g., PGC
     438). Normal galaxies are those that are not included in any list of
     A/SF galaxies or are not X-Ray or radio sources and have no recorded
     peculiar morphological and other properties.
Note (15): Information about the relation of the sample objects to pairs,
     groups or clusters of galaxies (from the NED).
--------------------------------------------------------------------------------

Acknowledgements:
    Artur Hakobyan, hakobyan(at)bao.sci.am
================================================================================
(End)                Artur Hakobyan [BAO], Patricia Vannier [CDS]    30-Jul-2010
