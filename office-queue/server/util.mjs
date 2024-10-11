export default function evaluateWaitingTime(tr, nr, ki, sir, i){
    
    tr = parseInt(tr, 10);
    nr = parseInt(nr, 10);
    //ki = parseInt(ki, 10);
    sir = parseInt(sir, 10);
    i = parseInt(i, 10);

    console.log('Service Time: ', tr, 'TicketInCoda: ', nr, 'N_ServiziDelCounter', ki);
    
    let res = 0;
    for(let j =0;j<i; j++){
        
        res += (1/parseInt(ki[j].total_services))*sir;        
    }
    console.log('denominatore;', res);

    let Tr = tr * ((nr / res) +0.5);
    console.log('risultato finale:', Tr);
    
    return Tr;
    
}