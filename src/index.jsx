import React, { Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './fonts.css';
import './style.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SharePage from './components/share';
import Endpoint from './components/endpoint';
import Preloader from './components/logic/preloader';
import { Toaster } from 'react-hot-toast';
import FontFaceObserver from 'fontfaceobserver'

const root = ReactDOM.createRoot(document.querySelector('#root'));

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(true)

  useEffect(() => {
    const fonts = [
      'acfilmstrip',
      'almendra-bold',
      'almendra-bolditalic',
      'AlteSchwabacherOSF-DemiBold',
      'AlteSchwabacher',
      'Answer-Regular',
      'AlteSchwabacher-Shadow',
      'Andada-BoldItalic',
      'Alterna',
      'AndadaSC-Regular',
      'AquaphonicDrought',
      'AndadaSC-Bold',
      'AmericanText',
      'ArgentumSans-Black',
      'ArgentumSans-ThinItalic',
      'AtlantisText-Regular',
      'AurelisADFNo2Std-Regular',
      'ArgentumSans-MediumItalic',
      'AvondaleOutline',
      'Avondale-Italic',
      'ArgentumSans-BlackItalic',
      'AtlantisText-Regular',
      'AthabascaRg-Italic',
      'ArgentumSans-Light',
      'ArgentumSansVF-Regular',
      'AthabascaCdEb-Italic',
      'AvrileSans-Thin',
      'AvondaleSCCond',
      'AvrileSansVF-Italic',
      'AvondaleSCOutline-Italic',
      'Besley-Semi',
      'BesleyCondensed-BookItalic',
      'BesleyNarrow-Book',
      'Blackletter-Shadow',
      'BlackletterExtraBold',
      'BlackChancery',
      'BlackForest-Regular',
      'BesleyNarrow-HeavyItalic',
      'BroadwayGradient3D-Regular',
      'BodonioNotebook-Italic',
      'Cardiff',
      'Casino3DFilled-Italic',
      'Casino3D-Italic',
      'BroadwayFlat3D-Italic',
      'Casino-Regular',
      'Broadway-Italic',
      'BroadwayFlat-Italic',
      'BullskritNFI',
      'CarrickCaps',
      'BodonioNotebook-Regular',
      'Chlorinar',
      'CMUBright-Oblique',
      'Casino3DFilledMarquee-Italic',
      'Damages-Regular',
      'Damages3D-Italic',
      'Damages3DFilled-Italic',
      'Chomsky',
      'CLAW2-BRK-',
      'DoubleBogeyBRK',
      'Dehuti-Bold-Italic',
      'Chicago-Regular',
      'CasinoFlat-Regular',
      'DBLayer3BRK',
      'DSCaslonGotischOsF',
      'DSCaslonGotisch',
      'DehutiAlt-Bold',
      'Dumbledor3Wide',
      'DSZierschrift',
      'Dumbledor2Shadow',
      'DSRomantiques',
      'Dumbledor3Shadow',
      'Dumbledor2Outline',
      'DSLutherscheHalbfett',
      'DSFetteKanzleiOsF',
      'EdGein-Ynnocent',
      'EncodeSansNarrow-Regular',
      'Erectlorite',
      'EncodeSansNormal-Bold',
      'Endor',
      'EndorAlt',
      'EdGein-Gwilty',
      'Duo-Licht',
      'Duo-Dunkel',
      'EditPointsFilled-Regular',
      'FiraSans-Book',
      'FanwoodText',
      'Exo20-Light',
      'EthnocentricRg-Italic',
      'Fanwood-Italic',
      'EtharnigSc',
      'Erthqake',
      'ErectloriteLight',
      'FetteBauerscheAntiquaShaddowUNZPro',
      'FlorencesansSCCond',
      'FiraSans-Two',
      'FiraSans-FourItalic',
      'Firecat-Medium',
      'FlorencesansSCBlack-Italic',
      'FloralDawn-Bold',
      'FiraSans-Medium',
      'FlorencesansComp-Italic',
      'GanzGrobeGotisch',
      'Halcion-Italic',
      'Glamor-Light',
      'Gotique',
      'Gotheroin',
      'Glamor-Regular',
      'GestureSlantBRK',
      'GothicFlourish',
      'GhastlyPanic',
      'Houtsneeletter-Regular',
      'GothicCornerCaps',
      'HeadlineText',
      'InertiaBRK',
      'ItalicHandMedium',
      'JosefinSlab-Italic',
      'Jost-Black',
      'Holtzschue-Regular',
      'Jost-Semi',
      'JosefinSlab-SemiBoldItalic',
      'Italianno-Regular',
      'JSL-Blackletter',
      'Independant-Alternates',
      'MaryJaneSmallCaps',
      'Kamikaze-Italic',
      'KingthingsLupine',
      'LettersIIFenotype',
      'MerriweatherUltraBold',
      'Kamikaze3DGradient-Italic',
      'Jurij-Regular',
      'KingthingsWidow',
      'Migha-BoldCondensedSlant',
      'Minaisgone3D-Regular',
      'Migha-BlackSemExpCNTRSlant',
      'Myra4FCaps-Light',
      'Mom-Halfblack',
      'Minaisgone-Regular',
      'ModerneFetteSchwabacher',
      'ModerneGekippteSchwabacher',
      'MetalMacabre',
      'Migha-ExpandedSlant',
      'Moderne3DSchwabacher',
      'Mom-Outline',
      'MesmerizeExEb-Italic',
      'Myra4FCaps',
      'Merriweather-BoldItalic',
      'Onderneming-Italic',
      'OccoluchiOutline',
      'NK57MonospaceSeRg-BoldItalic',
      'OccoluchiItalicOutline',
      'NK57MonospaceExRg-Italic',
      'NewtSerifDemi-Italic',
      'NexaRustSlab-BlackShadow01',
      'PricedownBl-Regular',
      'OpenSauceOne-BlackItalic',
      'PlayfairDisplay-BoldItalic',
      'Picadilly',
      'OpenSauceSans-Regular',
      'PindownPlainBRK',
      'OpenSauceOne-Regular',
      'PicaHole-MRST',
      'PlayfairDisplay-Bold',
      'RemainedBlack-Regular',
      'QuantumRoundHollowBRK',
      'QuantumRoundBRK',
      'RepublikaIVExp',
      'Schwachsinn3DFilled-Regular',
      'RepublikapsCnd',
      'Portabell-Regular',
      'QuasticKapsLine-Italic',
      'RepublikaIIICnd',
      'Qbicle2BRK',
      'PressStartK',
      'Schwachsinn-Regular',
      'QuasticKaps-Italic',
      'RessaBlur-Regular',
      'Schwachsinn3D-Italic',
      'Schwachsinn3D-Regular',
      'StreetBoldThin',
      'SeaGardens3DFilled-Italic',
      'SeaGardens3D-Regular',
      'Sesame-Shadow',
      'Sesame-Regular',
      'TejaratchiRegular',
      'SunnySpells-Regular',
      'TejaratchiWd',
      'SuperFoods',
      'Valkyrie-BoldExtended',
      'Valkyrie-BoldExtendedItalic',
      'TejaratchiExLefti',
      'TejaratchiCn',
      'warriot-Bold',
      'ZtShago-SemiBoldItalic',
      'ZtShago-Medium',
      'ZtShago-ExtraBoldItalic',
      'warriot-BoldItalic',
      'Trigram-Regular',
    ]

    const promises = fonts.map(font => new FontFaceObserver(font).load())

    Promise.all(promises)
      .then(() => {
        setFontsLoaded(true)
      })
      .catch((error) => {
        console.error('Font loading error:', error)
      })
  })

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Preloader />}>
          {fontsLoaded ? (<>
            <Toaster
              position={'top-right'}
              toastOptions={{
                style: {
                  margin: '15px',
                  background: '#828282',
                  color: '#fff',
                  fontSize: '15px',
                  width: '340px',
                },
                className: '',
                duration: 3000,
              }}
            />
            <Routes>
              <Route path='/' element={<Endpoint />} />
              <Route path='/sharedDesign' element={<SharePage />} />
            </Routes>
          </>) : null}
        </Suspense>
      </BrowserRouter>
    </>
  )
}

root.render(<App />);
