let wellArr=[];
let inptStat;
let chemStat;

//document.getElementById("wellsMenu").addEventListener('change', setWellAtt);
document.getElementById('calc').addEventListener('click', chemInptArray);
document.getElementById('addRow').addEventListener('click', addRow);
document.getElementById('remRow').addEventListener('click', removeRow);
document.getElementById('dlGraphs').addEventListener('click', dlGraphs);

function setWells() {
    let massPerCell=parseFloat(document.getElementById('massPerCell').value);
    let table=document.getElementById('wellPlaChar');
    let tableArr=[];
    wellArr=[];
    for (let i = 1, row; row = table.rows[i]; i++) {
        for(let j = 0, col;j<7 ;j++){
            if (j>4 || (i==12 && j!=0)){
                tableArr.push(col=row.cells[j].firstChild.value);
            }else{
                tableArr.push(col=row.cells[j].innerHTML);
            }
            
        }
    }

    for(let i=0;i<(tableArr.length);i=i+7){
        wellArr.push({cellTis:0,DOM:0,srmLip:0,srmAlb:0,hedSpc:parseFloat(tableArr[i+3])*10,wellNam:tableArr[i],dia:parseFloat(tableArr[i+1]),area:parseFloat(tableArr[i+2]),vol:parseFloat(tableArr[i+3]),volRang:tableArr[i+4],workVol:parseFloat(tableArr[i+5]),cellYield:parseFloat(tableArr[i+6]),wellTyp:true,massCells:parseFloat(tableArr[i+6])*massPerCell/1000000});
    }
    for (let i = 1, row; row = table.rows[i]; i++){
        row.cells[7].firstChild.value=wellArr[i-1].massCells;
    }

    //Setting well type of square wells to false
    wellArr[6].wellTyp=false;
    wellArr[8].wellTyp=false;
    wellArr[9].wellTyp=false;

    
}

function setWellAtt(){
    let wellOpt=document.getElementById('wellsMenu').value;
    let wellObj=wellArr.filter(function(obj){
        return obj.wellNam==wellOpt;
    });
    let sysParamInpt=document.getElementsByClassName('sysParam');
    let inpts=sysParamInpt[0].lastElementChild.getElementsByTagName('input');
    inptStat={strProtPRP:parseFloat(inpts[0].value),DOMPRP:parseFloat(inpts[1].value),strgLipOctPRP:parseFloat(inpts[2].value),strgLip:parseFloat(inpts[3].value),memLip:parseFloat(inpts[4].value),strProt:parseFloat(inpts[5].value),denCells:parseFloat(inpts[6].value),temp:parseFloat(inpts[7].value)+273.15,ionStr:parseFloat(inpts[8].value),vfSrm:parseFloat(inpts[9].value),cDOM:parseFloat(inpts[10].value),denDOM:parseFloat(inpts[11].value),alb:parseFloat(inpts[12].value), lip:parseFloat(inpts[13].value)};
    
    inptStat.cellWat=1-(inptStat.strgLip+inptStat.memLip+inptStat.strProt);
    
    //Change well object properties based on system parameters
    wellObj[0].DOM=(wellObj[0].workVol*inptStat.cDOM/1000/1000);
    wellObj[0].srmAlb=(wellObj[0].workVol*inptStat.vfSrm*inptStat.alb)/(1/.733)/1000;
    wellObj[0].srmLip=(wellObj[0].workVol*inptStat.vfSrm*inptStat.lip)/1000;
    wellObj[0].cellTis=wellObj[0].massCells/1000000/inptStat.denCells*1000000;

    //Output well object properties based on system parameters
    let sysParamOut=document.getElementsByClassName('testSysP');
    sysParamOut[0].innerHTML=wellObj[0].vol;
    sysParamOut[1].innerHTML=wellObj[0].workVol;
    sysParamOut[2].innerHTML=wellObj[0].hedSpc;
    sysParamOut[3].innerHTML=wellObj[0].srmAlb;
    sysParamOut[4].innerHTML=wellObj[0].srmLip;
    sysParamOut[5].innerHTML=wellObj[0].DOM;
    sysParamOut[6].innerHTML=wellObj[0].cellTis;
    sysParamOut[7].innerHTML=wellObj[0].massCells;

     
    inptStat.activWell=wellObj[0];

}

function chemCalc(inptChmStat){
    //Calculate surface area according to well shape
    let sorpOpt=document.getElementsByClassName('sorpVessel');
    let height = inptStat.activWell.workVol/(Math.PI*Math.pow((inptStat.activWell.dia/2),2));
    
    if(sorpOpt[1].checked){
        inptStat.activWell.surfAr=0;
    }else{
        if (inptStat.activWell.wellTyp){
            if (sorpOpt[0].checked){
                inptStat.activWell.surfAr=(2*Math.PI*inptStat.activWell.dia/2*height+Math.PI*Math.pow(inptStat.activWell.dia/2,2))/1000000;
            }else{
                inptStat.activWell.surfAr=(2*Math.PI*inptStat.activWell.dia/2*height)/1000000;
            }
        }else{
            if(sorpOpt[0].checked){
                inptStat.activWell.surfAr=(4*inptStat.activWell.dia*height+Math.pow(inptStat.activWell.dia,2))/1000000;
            }else{
                inptStat.activWell.surfAr=(4*inptStat.activWell.dia*height)/1000000;
            }
        }
    }


    
    chemStat={chemNam:inptChmStat[0],cas:inptChmStat[1],molWt:parseFloat(inptChmStat[2]),melPt:parseFloat(inptChmStat[3])+273.15,dSM:parseFloat(inptChmStat[4]),logKow:parseFloat(inptChmStat[5]),dUOW:parseFloat(inptChmStat[6]),logKmw:parseFloat(inptChmStat[7]),dUMW:parseFloat(inptChmStat[8]),logKaw:parseFloat(inptChmStat[9]),dUAW:parseFloat(inptChmStat[10]),cSAT:parseFloat(inptChmStat[11]),logPla:parseFloat(inptChmStat[12]),logKcw:parseFloat(inptChmStat[13]),logKsaw:parseFloat(inptChmStat[14]),Ksal:parseFloat(inptChmStat[15]),conc:parseFloat(inptChmStat[16])};

    if (isNaN(chemStat.dSM)){
        chemStat.dSM=56.5;
    }

    if (chemStat.melPt<=inptStat.temp){
        chemStat.Frat=1;
    }else{
        chemStat.Frat=Math.exp(-(chemStat.dSM/8.3144621)*(chemStat.melPt/inptStat.temp-1));
    }

    chemStat.logS1GSE=.5-chemStat.logKow;
    if (chemStat.melPt>298.15){
        chemStat.logSGSE=.5-.01*((chemStat.melPt-273.15)-25)-chemStat.logKow;
    } 

    if (isNaN(chemStat.logKmw)){
        chemStat.logKmw=1.01*chemStat.logKow+.12;
    }

    if (isNaN(chemStat.dUMW)){
        chemStat.dUMW=chemStat.dUOW;
    }

    chemStat.logKow=chemStat.logKow-chemStat.dUOW/(2.303*8.3144621)*(1/inptStat.temp-1/298.15);
    chemStat.Kow=Math.pow(10,chemStat.logKow);
    

    chemStat.logKmw=chemStat.logKmw-chemStat.dUMW/(2.303*8.3144621)*((1/inptStat.temp)-(1/298.15));
    chemStat.Kmw=Math.pow(10,chemStat.logKmw);

    chemStat.logKaw=chemStat.logKaw-chemStat.dUAW/(2.303*8.3144621)*((1/inptStat.temp)-(1/298.15));
    chemStat.Kaw=Math.pow(10,chemStat.logKaw);

    chemStat.logSWAT=Math.log10(chemStat.cSAT/1000/chemStat.molWt);
    chemStat.logSWAT=chemStat.logSWAT-(-1*chemStat.dUOW)/(2.303*8.3144621)*((1/inptStat.temp)-(1/298.15));
    chemStat.cSAT=Math.pow(10,chemStat.logSWAT);

    chemStat.logS1GSE=chemStat.logS1GSE-(-1*chemStat.dUOW)/(2.303*8.3144621)*((1/inptStat.temp)-(1/298.15));
    chemStat.S1GSE=Math.pow(10,chemStat.logS1GSE);

    if (chemStat.melPt>298.15){
        chemStat.logSGSE=chemStat.logSGSE-(-1*chemStat.dUOW)/(2.303*8.3144621)*((1/inptStat.temp)-(1/298.15));
        chemStat.SGSE=Math.pow(10,chemStat.logSGSE);
    }

    if (isNaN(chemStat.logPla)){
        chemStat.logPla=.97*chemStat.logKow-6.94;
    }
        
    chemStat.kPla=Math.pow(10,chemStat.logPla);

    if(isNaN(chemStat.logKcw)){
        chemStat.logKcw=Math.log10(inptStat.strgLipOctPRP*inptStat.strgLip*chemStat.Kow+inptStat.memLip*chemStat.Kmw+inptStat.strProtPRP*inptStat.strProt*chemStat.Kow+inptStat.cellWat);
    }else{
        chemStat.logKcw=(chemStat.logKcw-chemStat.dUOW)/(2.303*8.3144621)*((1/inptStat.temp)-(1/298.15));
    }
    chemStat.Kcw=Math.pow(10,chemStat.logKcw);

    let kSawOpt=document.getElementsByClassName('KsawOPT');

    if(isNaN(chemStat.logKsaw)){
        if(kSawOpt[0].checked){
            chemStat.Ksaw=Math.pow(10,(.71*chemStat.logKow+.42));
        }else if(kSawOpt[1].checked){
            if(chemStat.logKow<4.5){
                chemStat.Ksaw=Math.pow(10,(1.08*chemStat.logKow-.7));
            }else{
                chemStat.Ksaw=Math.pow(10,(.37*chemStat.logKow+2.56));
            }
        }
    }else{
        chemStat.logKsaw=(chemStat.logKsaw-chemStat.dUOW)/(2.303*8.3144621)*((1/inptStat.temp)-(1/298.15));
        chemStat.Ksaw=Math.pow(10,chemStat.logKsaw);
    }

    if (isNaN(chemStat.Ksal)){
        chemStat.Ksal=.04*chemStat.logKow+.114;
    }

    chemStat.cSAT=chemStat.cSAT*Math.pow(10,(-1*chemStat.Ksal*inptStat.ionStr));
    chemStat.S1GSE=chemStat.S1GSE*Math.pow(10,(-1*chemStat.Ksal*inptStat.ionStr));

    if(chemStat.melPt>298.15){
        chemStat.SGSE=chemStat.SGSE*Math.pow(10,(-1*chemStat.Ksal*inptStat.ionStr));
    }

    chemStat.SWATL=chemStat.cSAT/chemStat.Frat;

    chemStat.Kow=chemStat.Kow/Math.pow(10,(-1*chemStat.Ksal*inptStat.ionStr));
    chemStat.Kaw=chemStat.Kaw/Math.pow(10,(-1*chemStat.Ksal*inptStat.ionStr));
    chemStat.Kcw=chemStat.Kcw/Math.pow(10,(-1*chemStat.Ksal*inptStat.ionStr));
    chemStat.Ksaw=chemStat.Ksaw/Math.pow(10,(-1*chemStat.Ksal*inptStat.ionStr));

    let kSalOpt = document.getElementsByClassName("KsalOPT");

    if (kSalOpt[1].checked){
        if (chemStat.melPt>298.15){
            chemStat.cSAT=chemStat.SGSE;
            chemStat.SWATL=chemStat.S1GSE;
        }else{
            chemStat.cSAT=chemStat.S1GSE;
            chemStat.SWATL=chemStat.S1GSE;
        }
    }

    chemStat.sOctL=chemStat.Kow*chemStat.SWATL;
    chemStat.sCellL=chemStat.Kcw*chemStat.SWATL;


    chemStat.conc=chemStat.conc/1000000;
    
    chemStat.concInit=chemStat.conc;
    chemStat.mTot=chemStat.concInit*(inptStat.activWell.workVol/1000000);

    chemStat.concWat=chemStat.mTot / (chemStat.Kaw * inptStat.activWell.hedSpc/1000000 + inptStat.activWell.workVol/1000000 + chemStat.Ksaw * inptStat.activWell.srmAlb/1000000 + inptStat.strgLipOctPRP * chemStat.Kow * inptStat.activWell.srmLip/1000000 + chemStat.Kow * inptStat.DOMPRP * inptStat.activWell.DOM/1000000 + chemStat.Kcw * inptStat.activWell.cellTis/1000000 + 1000 * chemStat.kPla * inptStat.activWell.surfAr);

    if (chemStat.concWat>chemStat.cSAT){
        chemStat.concWatS=chemStat.cSAT;
    }else{
        chemStat.concWatS=chemStat.concWat;
    }

    chemStat.activity=chemStat.concWatS/chemStat.SWATL;

    if (inptStat.activWell.hedSpc/1000000>0){
        chemStat.concAir=chemStat.Kaw*chemStat.concWatS;
    }else{
        chemStat.concAir=0;
    }

    if (inptStat.activWell.srmAlb/1000000>0){
        chemStat.concAlb=chemStat.Ksaw*chemStat.concWatS;
    }else{
        chemStat.concAlb=0;
    }

    if (inptStat.activWell.srmLip/1000000>0){
        chemStat.concSrmLip=chemStat.Kow*chemStat.concWatS*inptStat.strgLipOctPRP;
    }else{
        chemStat.concSrmLip=0;
    }

    if(inptStat.activWell.DOM>0){
        chemStat.concDOM=chemStat.Kow*chemStat.concWatS*inptStat.DOMPRP;
    }else{
        chemStat.concDOM=0;
    }

    if(inptStat.activWell.cellTis>0){
        chemStat.concCells=chemStat.Kcw*chemStat.concWatS;
    }else{
        chemStat.concCells=0;
    }

    chemStat.concPla=chemStat.kPla*chemStat.concWatS*1000;

    chemStat.massWatS=chemStat.concWatS*inptStat.activWell.workVol/1000000;
    chemStat.massAir=chemStat.concAir*inptStat.activWell.hedSpc/1000000;
    chemStat.massSaw=chemStat.concAlb*inptStat.activWell.srmAlb/1000000;
    chemStat.massSrmLip=chemStat.concSrmLip*inptStat.activWell.srmLip/1000000;
    chemStat.massDom=chemStat.concDOM*inptStat.activWell.DOM/1000000;
    chemStat.massOfCell=chemStat.concCells*inptStat.activWell.cellTis/1000000;
    chemStat.massPla=chemStat.concPla*inptStat.activWell.surfAr;

    if (chemStat.concWat>chemStat.cSAT){
        chemStat.massPrecip=chemStat.mTot-(chemStat.massWatS+chemStat.massAir+chemStat.massSaw+chemStat.massSrmLip+chemStat.massDom+chemStat.massOfCell+chemStat.massPla);
    }else{
        chemStat.massPrecip=0;
    }

    chemStat.MFwatS=chemStat.massWatS/chemStat.mTot;
    chemStat.MFair=chemStat.massAir/chemStat.mTot;
    chemStat.MFsaw=chemStat.massSaw/chemStat.mTot;
    chemStat.MFsrmLip=chemStat.massSrmLip/chemStat.mTot;
    chemStat.MFdom=chemStat.massDom/chemStat.mTot;
    chemStat.MFcells=chemStat.massOfCell/chemStat.mTot;
    chemStat.MFpla=chemStat.massPla/chemStat.mTot;
    chemStat.MFprecip=chemStat.massPrecip/chemStat.mTot;

}

function outPutVal(colNum){
    let mfChemOut=document.getElementsByClassName('mfChemOut');
    mfChemOut[colNum*13+0].innerHTML=chemStat.chemNam;
    mfChemOut[colNum*13+1].innerHTML=chemStat.cas;
    mfChemOut[colNum*13+2].innerHTML=rnd3(chemStat.logKow);
    mfChemOut[colNum*13+3].innerHTML=rnd3(chemStat.logKaw);
    mfChemOut[colNum*13+4].innerHTML=rnd3(chemStat.MFair*100);
    mfChemOut[colNum*13+5].innerHTML=rnd3((chemStat.MFwatS+chemStat.MFsaw+chemStat.MFsrmLip+chemStat.MFdom)*100);
    mfChemOut[colNum*13+6].innerHTML=rnd3(chemStat.MFsaw*100);
    mfChemOut[colNum*13+7].innerHTML=rnd3(chemStat.MFsrmLip*100);
    mfChemOut[colNum*13+8].innerHTML=rnd3(chemStat.MFdom*100);
    mfChemOut[colNum*13+9].innerHTML=rnd3(chemStat.MFwatS*100);
    mfChemOut[colNum*13+10].innerHTML=rnd3(chemStat.MFcells*100);
    mfChemOut[colNum*13+11].innerHTML=rnd3(chemStat.MFpla*100);
    mfChemOut[colNum*13+12].innerHTML=rnd3(chemStat.MFprecip*100);
        

    let mbChemOut=document.getElementsByClassName('mbChemOut');
    mbChemOut[colNum*12+0].innerHTML=chemStat.chemNam;
    mbChemOut[colNum*12+1].innerHTML=chemStat.cas;
    mbChemOut[colNum*12+2].innerHTML=rnd3(chemStat.logKow);
    mbChemOut[colNum*12+3].innerHTML=rnd3(chemStat.logKaw);
    mbChemOut[colNum*12+4].innerHTML=rnd3(chemStat.massAir*1000000);
    mbChemOut[colNum*12+5].innerHTML=rnd3(chemStat.massWatS*1000000);
    mbChemOut[colNum*12+6].innerHTML=rnd3(chemStat.massSaw*1000000);
    mbChemOut[colNum*12+7].innerHTML=rnd3(chemStat.massSrmLip*1000000);
    mbChemOut[colNum*12+8].innerHTML=rnd3(chemStat.massDom*1000000);
    mbChemOut[colNum*12+9].innerHTML=rnd3(chemStat.massOfCell*1000000);
    mbChemOut[colNum*12+10].innerHTML=rnd3(chemStat.massPla*1000000);
    mbChemOut[colNum*12+11].innerHTML=rnd3(chemStat.massPrecip*1000000);

    let concChemOut=document.getElementsByClassName("concChemOut");
    concChemOut[colNum*16+0].innerHTML=chemStat.chemNam;
    concChemOut[colNum*16+1].innerHTML=chemStat.cas;
    concChemOut[colNum*16+3].innerHTML=rnd3(chemStat.logKow);
    concChemOut[colNum*16+2].innerHTML=rnd3(chemStat.logKaw);
    concChemOut[colNum*16+4].innerHTML=rnd3(chemStat.concInit);
    concChemOut[colNum*16+5].innerHTML=rnd3(chemStat.concAir);
    concChemOut[colNum*16+6].innerHTML=rnd3(1000000000000*(chemStat.massWatS+chemStat.massSaw+chemStat.massSrmLip+chemStat.massDom)/(inptStat.activWell.workVol+inptStat.activWell.srmAlb+inptStat.activWell.srmLip+inptStat.activWell.DOM));
    concChemOut[colNum*16+7].innerHTML=rnd3(chemStat.concAlb*1000000);
    concChemOut[colNum*16+8].innerHTML=rnd3(chemStat.concSrmLip*1000000);
    concChemOut[colNum*16+9].innerHTML=rnd3(chemStat.concDOM*1000000);
    concChemOut[colNum*16+10].innerHTML=rnd3(chemStat.concWatS*1000000);
    concChemOut[colNum*16+11].innerHTML=rnd3(Math.pow((chemStat.concWatS/chemStat.concInit),-1));
    concChemOut[colNum*16+12].innerHTML=rnd3(chemStat.concCells*1000000);
    concChemOut[colNum*16+13].innerHTML=rnd3(chemStat.concCells*chemStat.molWt*1000000);
    concChemOut[colNum*16+14].innerHTML=rnd3(chemStat.concCells/chemStat.concInit);
    concChemOut[colNum*16+15].innerHTML=rnd3(chemStat.concPla*1000000);



}

function rnd3(num){
    return (num.toPrecision(3))
}

function addRow(){
    let table=document.getElementById("inptChemTable");
    
    let newRow=table.insertRow();
    

    for(let i=0;i<17;i++){
        let cell=newRow.insertCell(i);
        
        let inputNode=document.createElement('input');
        
        inputNode.type='number';

        if(i==0 || i==1){
            inputNode.type='text';
        }else if (i==4){
            inputNode.value='56.5';
        }else if(i==6){
            inputNode.value='-20000';
        }else if(i==10){
            inputNode.value='60000';
        }

        inputNode.className='chemINP';
        
        cell.appendChild(inputNode);
        
    }
    addOutputRows("massFractionTable","mfChemOut");
    addOutputRows("massBalanceTable","mbChemOut");
    addOutputRows("concentrationTable","concChemOut");
}

function addOutputRows(id,clsNam){
    let table=document.getElementById(id);
    let newRow=table.insertRow();
    
    for(let i=0;i<table.rows[0].cells.length;i++){
        let cell = newRow.insertCell(i);
        let outputNode=document.createElement('output');
        outputNode.className=clsNam;
        cell.appendChild(outputNode);
    }

}

function chemInptArray(){
    let inpt=document.getElementsByClassName('chemINP');
    let inptChmStat=[];

    for(let itm of inpt){
        inptChmStat.push(itm.value);
    }


    for (let i=0;i<inptChmStat.length;i=i+17){
        chemCalc(inptChmStat.slice(i,i+17));
        outPutVal(i/17);
    }
}

function removeRow(){
    document.getElementById('inptChemTable').deleteRow(-1);
    document.getElementById('massFractionTable').deleteRow(-1);
    document.getElementById('massBalanceTable').deleteRow(-1);
    document.getElementById('concentrationTable').deleteRow(-1);
}

function dlGraphs(){
    let tables = $(".outputTable");
    let export_tables= new TableExport(tables,{
        formats:['xlsx'],
        exportButtons:false
    });

    let tables_data=export_tables.getExportData();
    let export_data=[];
    let xlsx_info={};

    for(let table_id in tables_data){
        xlsx_info=tables_data[table_id]["xlsx"];
        export_data.push(tables_data[table_id]["xlsx"].data);
    }

    let fileExtension=xlsx_info.fileExtension;
    let mimeType=xlsx_info.mimeType;

    export_tables.exportmultisheet(export_data, mimeType, "Results",["Mass Fractions","Concentrations","Mass Balance"],fileExtension,{},[]);

}


$("#wellPlaChar :input").on({
    change:setWells
});

$(setWells);
$(setWellAtt);

$("#wellsMenu").on({
    change:setWellAtt
});

$(".col-50 :input").on({
    change:setWellAtt
});
