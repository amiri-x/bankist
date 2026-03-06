# bankist-app

Is a simple simultion of banking

just a learning project

- Enhanced form of the base project [Bankist](https://bankist.netlify.app/) by Jonas Schmedtmann

## NOTE

This project is based on Bankist App from JavaScript course by Jonas Schmetdmann

It was built for learning purposes and extended with personal refactoring and additional improvemnts.

Original project - © Jonas Schmetdmann

## Improvements I Made

**Login:**

- Showing failure login message on wrong credentials
- Using strings for pins for better compatibility and extra valid pins e.g `0011`
- Improved UX by auto set focus to empty fields

**Transfer:**

- Showing failure transfer message on username, invalid amount
- Using `input type="text"` for better ux and ablity to transfer minor amounts like: `$1.99`
- Showing placeholders for better UX
- Improved UX by auto set focus to empty fields

**Loan:**

- Showing placeholders for better UX
- Improved UX by disabling the field and button until loan is done

**Additional refactoring:**

- Used a [Helper module](helper.js) for helper/static functions
- Add comments for better code scaning
