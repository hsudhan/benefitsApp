# Banking Web Application Specification


## 1. Project Overview


A secure, responsive Node.js and TypeScript banking web application. It
features a login screen with password visibility toggles and a tabbed
dashboard that displays multiple account types, balances, and monthly
financial summaries.


## 2. Login Screen


The entry point of the app for user authentication.


### UI Features


- **Username Field**: Text input for username or email.
- **Password Field**: Text input with an eye icon.
 - Default mode: masks characters as dots (••••••).
 - Click the eye icon to toggle between clear text and dots.
- **Forgot Options**: Clickable text links for "Forgot User" and "Forgot
 Password".
- **Login Button**: Submits credentials. Successful validation loads the
 Dashboard page.


## 3. Dashboard Page


The main hub of the application displaying core banking data.


### Navigation (Tab Group)


A top-level tab menu. Clicking a tab opens its respective page.


> Note: The "Accounts" tab is loaded by default.


### Menu Tabs


- **Accounts**: Shows customer account details and balances.
- **Pay & Transfer**: Access to bills and money transfers.
- **Plan & Track**: Budgeting and spending trackers.
- **Investments**: Portfolio and stock summaries.
- **Security & Privacy**: Settings for passwords and two-factor
 authentication.
- **Explore Products**: View and apply for new bank offers.


## 4. Accounts Tab Details


The default view displaying the customer's account portfolio.


### Data Displayed


For each account, the app will display:


- **Account Type**: Checking, Savings, or CD Deposits.
- **Available Balance**: Current spendable or withdrawable funds.
- **Total Deposits This Month**: Sum of all money added to the account.
- **Total Withdrawals This Month**: Sum of all money removed from the
 account.


## 5. Implementation Stack


- **Runtime**: Node.js for server-side logic.
- **Language**: TypeScript for type safety and reduced bugs.
- **Framework Examples**: Consider using frameworks like React or Next.js
 for the user interface. See open-source reference repositories on GitHub
 (e.g. React Bank) for inspiration.



# Benefits Web Application Specification


## 1. Project Overview


A secure, responsive Node.js and TypeScript banking web application. It
features a login screen with password visibility toggles and a tabbed
dashboard that displays multiple tiles with benefits data


Do not add any additional gold plating or something that is not part of requirements. 


## 2. Login Screen


The entry point of the app for user authentication.


### UI Features


- **Username Field**: Text input for username or email.
- **Password Field**: Text input with an eye icon.
 - Default mode: masks characters as dots (••••••).
 - Click the eye icon to toggle between clear text and dots.
- **Forgot Options**: Clickable text links for "Forgot User" and "Forgot
 Password".
- **Login Button**: Submits credentials. Successful validation loads the
 Dashboard page.




### Navigation  


A top-level   menu. This should have 4 tabs as below
Dashboard
Total Comp
Portfolio & Banking
Benefits



### Dashboard
This tab should be left blank


### Compensation page


This should be a 4 tile format in a single row. White bg….and black FG with total amounts in font size 22


- **Base Salary**: show total amount field value $185,000 and in the next row description field “Annual”
- **Cash Bonus**: Shows total amount field value $27,750, and in the next row, indicator UP DOWN Arrow depending on percentage value (could be any value between 0-100%).. Use 18% as value to be shown
- **PLTR RSU Value (YTD)**: shows total amount field value $94,200 and in the next row it should show “TBD shared vested”
- **Open Enrollment**: shows Beginning date of the enrollment start, and in the next row shows description “green up arrow with 18% YOY in green font”
 
Ensure data model loads from DTO objects that are fetched through APIs to backend that fetches from DB postgresql.


### Portfolio & Banking
This tab should be left blank




### Benefits page


This should be a 4 tile format in a single row. White bg….and black FG with total amounts in font size 22


Benefits
- **Total Benefit Value **: show total amount field value and in the next row description field “Annual Employer Contribution”
- **Utilized**: Shows total amount field value, and in the next row, indicator UP DOWN Arrow depending and percentage value (could be any value between 0-100%)
- **Unclaimed**: shows total amount field value and in the next row it should show expiry date
- **Open Enrollment**: shows Beginning date of the enrollment start, and in the next row shows description about benefit elections windows (example: Next Enrollment Window) 
 
Quick Actions
Do not add any subtitle below the “quick actions”
Data Displayed
A rectangular black bar image in the top row and following text in the bottom row
- **NW Worth**: 
A rectangular black bar image in the top row and following text in the bottom row
- **RSU Vest**: 
A rectangular black bar image in the top row and following text in the bottom row
- **Risk Conc.**: 
A rectangular black bar image in the top row and following text in the bottom row
- **401K Match**: 


For FOUR HYPERLINK in a separate row below one after the another, FIT to SCREEN width
RSU Vesting
Diversification
Tax Planning
Retirement


Health and Wellness
Do not add any subtitle under this section. 


- **Runtime**: Node.js for server-side logic.
- **Language**: TypeScript for type safety and reduced bugs.
- **Framework Examples**: Consider using frameworks like React or Next.js
 for the user interface. See open-source reference repositories on GitHub
 (e.g. React Bank) for inspiration.
It should have the following UI tiles each of them having the same format from a data display perspective. It should be  2 rows of 3 tiles each as mentioned below 


TOP LEFT first row: ACTIVE (with green highlight and shading and Black foreground font)
- **Medical Insurance**: Palantir covers 100% premium for employee + family. Anthem Blue Cross PPO, $500 deductible. Show in the row below “UTILIZATION: 100% | $0 PREMIUM”
Show a CSS based thermometer reading UI widget that shows based on the UTILIZATION percentage. For the foreground Use GREEN  color and background use grey. Use the following color coding logic: 
For utlization between 80-100% use green foreground, and use ORANGE Foreground for 00-80%


TOP LEFT first row: ACTIVE (with green highlight and shading and Black foreground font)
- **Dental Insurance**: In-network annual maximum preventive care 100% covered. Orthodontics 50% up to $1500. Show in the row below “UTILIZATION: 45% | $2000/YEAR”.
Show a CSS based thermometer reading UI widget that shows based on the UTILIZATION percentage.


TOP LEFT first row: ACTIVE (with green highlight and shading and Black foreground font)
- **Vision Insurance**: Frames + contacts allowance. Annual eye exam covered. VSP network. Show in the  row below “UTILIZATION: 0% | $500/YEAR”.
Show a CSS based thermometer reading UI widget that shows based on the UTILIZATION percentage.


TOP LEFT first row: UNCLAIMED (with orange highlight and shading and RED foreground font)
- **HSA Employer Match**: 50% employer match on upto $4800 HSA contribution. You have contributed $0 this year. Expire Dec 31. Show in the next row “UTILIZATION: 0% | $2400”.
Show a CSS based thermometer reading UI widget that shows based on the UTILIZATION percentage.


TOP LEFT first row: PARTIAL (with orange highlight and shading and RED foreground font)
- **Commuter Benefits**: s$200/mon pre-tax commuter benefit. Currently using $65/mo - $420 unclaimed this year. Show in the next row “UTILIZATION: 82% | $420 UNCLAIMED”.
Show a CSS based thermometer reading UI widget that shows based on the UTILIZATION percentage.


TOP LEFT first row: ENROLLED (with green highlight and shading and Black foreground font)
- **Dependent Care FSA**: Fully enrolled. $3200 remaining for 2026. Use for childcare, after-school program. Show in the next row “UTILIZATION: 36% | $5000”.
Show a CSS based thermometer reading UI widget that shows based on the UTILIZATION percentage.


The following UI tiles each of them having the same format from a data display perspective. It should be  1 rows of 2 tiles as mentioned below 


Retirement 
- **401K - Fidelity Net Benefits**: show total amount field value and in the next row description field “Annual Employer Contribution”
- **PLTR RSU Program - Morgan Stanley**: show total amount field value and in the next row description field “Annual Employer Contribution”


in the benefitsA-app remove the toolbars menu options...and have all the section as inline tiles display ...display them  one below the other  in the following order
1. dashboard
2. quick actions
3. health & wellness
4. Retirement & Equity 


The model data for the tiles to be fetched from server side webservice restful JSON APIs that will be invoked from front-end using MVC and should be loosely coupled. The server side APIs should be independent of the client side REACT JS modules. The server side APIs should be configured to fetch from DB in future. 


Create appropriate tables in postgresql and load data that will return the corresponding DTO model objects to the api layer.


regenerate the code and redeploy on localhost:3000
—-----------------------------
Ensure getRetirementTiles uses its own DTO object name and not BenefitTileDTO. 
Also load the DTO from a different postgresql database table and not benefit_tiles table.
regenerate the code and redeploy on localhost:3000
