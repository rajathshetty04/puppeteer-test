const puppeteer = require("puppeteer");

const getURL = (url) => {
  const RegEx =
    /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
  const newURL = url.match(RegEx);
  console.log(newURL[0]);
  return newURL[0];
};

const checkProductDetails = async (productLink) => {
  let browser;
  try {
    const url = await getURL(productLink);

    browser = await puppeteer.launch({
      headless: "true",
    });
    console.log("browser opened");
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector("#productTitle");
    await page.waitForSelector(".a-price-whole");
    const result = await page.evaluate(() => {
      return {
        name: document.querySelector("#productTitle").innerText,
        currentPrice: parseFloat(
          document.querySelector(".a-price-whole").innerText.replace(/,/g, "")
        ),
      };
    });
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    console.log("browser closed");
    await browser.close();
  }
};

checkProductDetails("https://amzn.eu/d/6Do2Yan");
