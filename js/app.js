/*
 *  Copyright (c) 2015, Parse, LLC. All rights reserved.
 *
 *  You are hereby granted a non-exclusive, worldwide, royalty-free license to
 *  use, copy, modify, and distribute this software in source code or binary
 *  form for use in connection with the web services and APIs provided by Parse.
 *
 *  As with any software that integrates with the Parse platform, your use of
 *  this software is subject to the Parse Terms of Service
 *  [https://www.parse.com/about/terms]. This copyright notice shall be
 *  included in all copies or substantial portions of the software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *  IN THE SOFTWARE.
 *
 */

var React = require('react');
var Parse = require('parse').Parse;
var TeamzApp = require('./TeamzApp.react.js');
var TeamzUtils = require('./TeamzUtils.js');

var TeamzKeys = require('../settings/TeamzKeys');
var CryptoJS = require("crypto-js");

var ENCRYPTED_APPLICATION_ID = 'U2FsdGVkX19OsSNQP8z6BjpGgcDCFtJpa8GnqzmsuC++BK0MDHwvACKfRes5TR3n6Fyo6X5JNvwSAoEov/KgVw==';
var ENCRYPTED_JAVASCRIPT_KEY = 'U2FsdGVkX1+baXKyPNR1dYT1vX5HIFqDnQn9OX8CrbQo/cXl1ns6FEWFBKqLgjD/ADyPhCG1VxhfYz4exBZ5Kg==';

initializeParse();

React.render(
  <TeamzApp history={false} />,
  document.getElementById('app')
);

// Decrypt keys and initialize parse app
function initializeParse() {
  var bytes = CryptoJS.AES.decrypt(
    ENCRYPTED_APPLICATION_ID, 
    TeamzKeys.getApplicationIdEncryptKey()
  );
  var applicationId = bytes.toString(CryptoJS.enc.Utf8);

  bytes = CryptoJS.AES.decrypt(
    ENCRYPTED_JAVASCRIPT_KEY, 
    TeamzKeys.getJavascriptKeyEncryptKey()
  ); 
  var javascriptKey = bytes.toString(CryptoJS.enc.Utf8);
  
  // Insert your app's keys here:
  Parse.initialize(applicationId, javascriptKey);
}