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
