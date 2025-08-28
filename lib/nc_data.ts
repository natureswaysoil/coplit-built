export const NC_COUNTIES = [
  'Alamance','Alexander','Alleghany','Anson','Ashe','Avery','Beaufort','Bertie','Bladen','Brunswick','Buncombe','Burke','Cabarrus','Caldwell','Camden','Carteret','Caswell','Catawba','Chatham','Cherokee','Chowan','Clay','Cleveland','Columbus','Craven','Cumberland','Currituck','Dare','Davidson','Davie','Duplin','Durham','Edgecombe','Forsyth','Franklin','Gaston','Gates','Graham','Granville','Greene','Guilford','Halifax','Harnett','Haywood','Henderson','Hertford','Hoke','Hyde','Iredell','Jackson','Johnston','Jones','Lee','Lenoir','Lincoln','Macon','Madison','Martin','McDowell','Mecklenburg','Mitchell','Montgomery','Moore','Nash','New Hanover','Northampton','Onslow','Orange','Pamlico','Pasquotank','Pender','Perquimans','Person','Pitt','Polk','Randolph','Richmond','Robeson','Rockingham','Rowan','Rutherford','Sampson','Scotland','Stanly','Stokes','Surry','Swain','Transylvania','Tyrrell','Union','Vance','Wake','Warren','Washington','Watauga','Wayne','Wilkes','Wilson','Yadkin','Yancey'
];

// Common NC cities mapped to counties (extend as needed)
export const NC_CITY_TO_COUNTY: Record<string, string> = {
  'raleigh': 'Wake',
  'cary': 'Wake',
  'apex': 'Wake',
  'durham': 'Durham',
  'chapel hill': 'Orange',
  'charlotte': 'Mecklenburg',
  'huntersville': 'Mecklenburg',
  'greensboro': 'Guilford',
  'high point': 'Guilford',
  'winston-salem': 'Forsyth',
  'fayetteville': 'Cumberland',
  'wilmington': 'New Hanover',
  'greenville': 'Pitt',
  'asheville': 'Buncombe',
  'concord': 'Cabarrus',
  'gastonia': 'Gaston',
  'jacksonville': 'Onslow',
  'hickory': 'Catawba',
  'mooresville': 'Iredell',
  'rocky mount': 'Nash',
  'kannapolis': 'Cabarrus',
};

// NC ZIP codes mapped to counties (major metropolitan areas)
export const NC_ZIP_TO_COUNTY: Record<string, string> = {
  // Wake County (Raleigh area)
  '27502': 'Wake', '27511': 'Wake', '27513': 'Wake', '27518': 'Wake', '27519': 'Wake',
  '27523': 'Wake', '27526': 'Wake', '27529': 'Wake', '27539': 'Wake', '27540': 'Wake',
  '27545': 'Wake', '27560': 'Wake', '27562': 'Wake', '27571': 'Wake', '27587': 'Wake',
  '27591': 'Wake', '27592': 'Wake', '27597': 'Wake', '27601': 'Wake', '27602': 'Wake',
  '27603': 'Wake', '27604': 'Wake', '27605': 'Wake', '27606': 'Wake', '27607': 'Wake',
  '27608': 'Wake', '27609': 'Wake', '27610': 'Wake', '27611': 'Wake', '27612': 'Wake',
  '27613': 'Wake', '27614': 'Wake', '27615': 'Wake', '27616': 'Wake', '27617': 'Wake',

  // Mecklenburg County (Charlotte area)
  '28078': 'Mecklenburg', '28105': 'Mecklenburg', '28134': 'Mecklenburg', '28202': 'Mecklenburg',
  '28203': 'Mecklenburg', '28204': 'Mecklenburg', '28205': 'Mecklenburg', '28206': 'Mecklenburg',
  '28207': 'Mecklenburg', '28208': 'Mecklenburg', '28209': 'Mecklenburg', '28210': 'Mecklenburg',
  '28211': 'Mecklenburg', '28212': 'Mecklenburg', '28213': 'Mecklenburg', '28214': 'Mecklenburg',
  '28215': 'Mecklenburg', '28216': 'Mecklenburg', '28217': 'Mecklenburg', '28226': 'Mecklenburg',
  '28227': 'Mecklenburg', '28244': 'Mecklenburg', '28262': 'Mecklenburg', '28269': 'Mecklenburg',
  '28270': 'Mecklenburg', '28273': 'Mecklenburg', '28274': 'Mecklenburg', '28277': 'Mecklenburg',
  '28278': 'Mecklenburg', '28280': 'Mecklenburg', '28281': 'Mecklenburg', '28282': 'Mecklenburg',

  // Durham County
  '27701': 'Durham', '27702': 'Durham', '27703': 'Durham', '27704': 'Durham', '27705': 'Durham',
  '27706': 'Durham', '27707': 'Durham', '27708': 'Durham', '27709': 'Durham', '27710': 'Durham',
  '27711': 'Durham', '27712': 'Durham', '27713': 'Durham',

  // Orange County (Chapel Hill/Carrboro)
  '27278': 'Orange', '27302': 'Orange', '27510': 'Orange', '27514': 'Orange', '27515': 'Orange',
  '27516': 'Orange', '27517': 'Orange',

  // Guilford County (Greensboro)
  '27214': 'Guilford', '27233': 'Guilford', '27235': 'Guilford', '27260': 'Guilford', '27262': 'Guilford',
  '27263': 'Guilford', '27265': 'Guilford', '27282': 'Guilford', '27283': 'Guilford', '27284': 'Guilford',
  '27285': 'Guilford', '27301': 'Guilford', '27310': 'Guilford', '27313': 'Guilford', '27320': 'Guilford',
  '27357': 'Guilford', '27358': 'Guilford', '27377': 'Guilford', '27401': 'Guilford', '27402': 'Guilford',
  '27403': 'Guilford', '27404': 'Guilford', '27405': 'Guilford', '27406': 'Guilford', '27407': 'Guilford',
  '27408': 'Guilford', '27409': 'Guilford', '27410': 'Guilford', '27411': 'Guilford', '27412': 'Guilford',
  '27413': 'Guilford', '27415': 'Guilford', '27416': 'Guilford', '27417': 'Guilford', '27419': 'Guilford',
  '27420': 'Guilford', '27425': 'Guilford', '27427': 'Guilford', '27429': 'Guilford', '27435': 'Guilford',
  '27438': 'Guilford', '27455': 'Guilford', '27480': 'Guilford', '27495': 'Guilford', '27497': 'Guilford',
  '27498': 'Guilford', '27499': 'Guilford',

  // Forsyth County (Winston-Salem)
  '27012': 'Forsyth', '27023': 'Forsyth', '27040': 'Forsyth', '27045': 'Forsyth', '27101': 'Forsyth',
  '27102': 'Forsyth', '27103': 'Forsyth', '27104': 'Forsyth', '27105': 'Forsyth', '27106': 'Forsyth',
  '27107': 'Forsyth', '27108': 'Forsyth', '27109': 'Forsyth', '27110': 'Forsyth', '27111': 'Forsyth',
  '27113': 'Forsyth', '27114': 'Forsyth', '27115': 'Forsyth', '27116': 'Forsyth', '27117': 'Forsyth',
  '27120': 'Forsyth', '27127': 'Forsyth', '27130': 'Forsyth', '27150': 'Forsyth', '27152': 'Forsyth',
  '27155': 'Forsyth', '27157': 'Forsyth', '27198': 'Forsyth', '27199': 'Forsyth',

  // Cumberland County (Fayetteville)
  '28301': 'Cumberland', '28302': 'Cumberland', '28303': 'Cumberland', '28304': 'Cumberland',
  '28305': 'Cumberland', '28306': 'Cumberland', '28307': 'Cumberland', '28308': 'Cumberland',
  '28309': 'Cumberland', '28310': 'Cumberland', '28311': 'Cumberland', '28312': 'Cumberland',
  '28314': 'Cumberland', '28315': 'Cumberland', '28318': 'Cumberland', '28334': 'Cumberland',
  '28348': 'Cumberland', '28356': 'Cumberland', '28390': 'Cumberland', '28391': 'Cumberland',

  // New Hanover County (Wilmington)
  '28401': 'New Hanover', '28402': 'New Hanover', '28403': 'New Hanover', '28404': 'New Hanover',
  '28405': 'New Hanover', '28406': 'New Hanover', '28407': 'New Hanover', '28408': 'New Hanover',
  '28409': 'New Hanover', '28410': 'New Hanover', '28411': 'New Hanover', '28412': 'New Hanover',
  '28428': 'New Hanover', '28429': 'New Hanover', '28449': 'New Hanover', '28479': 'New Hanover',

  // Pitt County (Greenville)
  '27828': 'Pitt', '27829': 'Pitt', '27833': 'Pitt', '27834': 'Pitt', '27836': 'Pitt', '27837': 'Pitt',
  '27858': 'Pitt', '27884': 'Pitt', '27886': 'Pitt',

  // Buncombe County (Asheville)
  '28701': 'Buncombe', '28704': 'Buncombe', '28709': 'Buncombe', '28711': 'Buncombe', '28715': 'Buncombe',
  '28730': 'Buncombe', '28732': 'Buncombe', '28748': 'Buncombe', '28778': 'Buncombe', '28787': 'Buncombe',
  '28791': 'Buncombe', '28801': 'Buncombe', '28802': 'Buncombe', '28803': 'Buncombe', '28804': 'Buncombe',
  '28805': 'Buncombe', '28806': 'Buncombe', '28810': 'Buncombe', '28813': 'Buncombe', '28814': 'Buncombe',
  '28815': 'Buncombe', '28816': 'Buncombe',

  // Cabarrus County (Concord/Kannapolis)
  '28023': 'Cabarrus', '28025': 'Cabarrus', '28026': 'Cabarrus', '28027': 'Cabarrus', '28075': 'Cabarrus',
  '28081': 'Cabarrus', '28083': 'Cabarrus', '28107': 'Cabarrus', '28124': 'Cabarrus',

  // Gaston County (Gastonia)
  '28012': 'Gaston', '28016': 'Gaston', '28032': 'Gaston', '28033': 'Gaston', '28034': 'Gaston',
  '28052': 'Gaston', '28053': 'Gaston', '28054': 'Gaston', '28055': 'Gaston', '28056': 'Gaston',
  '28077': 'Gaston', '28098': 'Gaston', '28101': 'Gaston', '28120': 'Gaston',

  // Onslow County (Jacksonville)
  '28445': 'Onslow', '28460': 'Onslow', '28539': 'Onslow', '28540': 'Onslow', '28541': 'Onslow',
  '28542': 'Onslow', '28543': 'Onslow', '28544': 'Onslow', '28545': 'Onslow', '28546': 'Onslow',
  '28547': 'Onslow', '28555': 'Onslow', '28573': 'Onslow', '28574': 'Onslow',

  // Catawba County (Hickory)
  '28601': 'Catawba', '28602': 'Catawba', '28603': 'Catawba', '28609': 'Catawba', '28610': 'Catawba',
  '28612': 'Catawba', '28613': 'Catawba', '28630': 'Catawba', '28650': 'Catawba', '28658': 'Catawba',

  // Iredell County (Mooresville/Statesville)
  '28115': 'Iredell', '28117': 'Iredell', '28125': 'Iredell', '28166': 'Iredell', '28625': 'Iredell',
  '28634': 'Iredell', '28636': 'Iredell', '28660': 'Iredell', '28677': 'Iredell', '28678': 'Iredell',

  // Nash County (Rocky Mount)
  '27801': 'Nash', '27802': 'Nash', '27803': 'Nash', '27804': 'Nash', '27807': 'Nash', '27809': 'Nash',
  '27856': 'Nash', '27891': 'Nash', '27896': 'Nash'
};
