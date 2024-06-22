export default function CCB({ index, carbon, countryName }) {

    index = index || 10
    carbon = carbon || "..."
    countryName = countryName || "..."

    return <div className='data'>
        <span className='country-name'>{countryName}</span>
        <progress className={`country-report-${index}`} value={carbon} max="100"></progress>
        <span className='total-value'>{carbon}</span>
    </div >

}