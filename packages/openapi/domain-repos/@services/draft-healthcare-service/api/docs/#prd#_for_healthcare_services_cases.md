# In/Out of Scope

| Status | Requirement                                                                                                                                                |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| In     | As a Buyer, I should be able to Search, Compare, Schedule and Book Lab Tests for me or my Family                                                           |
| In     | As a Buyer, I should be able to take tests either from the convenience of my Home or at a nearby Laboratory                                                |
| In     | As a Buyer, I should be able to book a test where Multiple visits by Phlebo are required (for the same test)                                               |
| In     | As a Buyer, I should be able to edit the number of Tests or Number of patients at the time of fulfilment                                                   |
| In     | As a Buyer, I should be able to reschedule or cancel the Lab Tests in case of unforeseen circumstances                                                     |
| In     | As a Seller, I should be able to Re collect the sample, in case the Sample is not relevant                                                                 |
| Out    | As a Buyer, I choose a phlebo of my choice                                                                                                                 |
| Out    | As a Buyer, I should be able to book a “Consent” based test                                                                                                |
| Out    | As a Seller, I should be allowed to send Seller Side recommendations of tests that can be done together to the buyer when the buyer is building their cart |

# List of Use Cases

| S.No. | Description                                                                                                                     |
| ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1     | As a Buyer: I aim to seamlessly Search, Compare, Book, and Schedule Lab Tests.                                                  |
| -     | So That: I can efficiently connect with potential Sellers within the network to fulfil requirements.                            |
| -     | When: Whether I require the test immediately or in the future,                                                                  |
| -     | Why: It could be due to a doctor's prescription or as a preventive measure.                                                     |
| 2     | As a Seller: I aim to Offer individual tests or Packages with complete transparency, accessible across all locations and times. |
| -     | So That:                                                                                                                        |
| -     | Potential Buyers can easily access and engage with the services I provide.                                                      |
| -     | When: Meeting the convenience of the Buyer, be it at home, walk-ins, or available time slots.                                   |
| -     | Why:This approach enables me to expand my reach to more Buyers and provide a wider range of Services.                           |

# Detailed Use Cases

| Use Case 1       | Buyer raises a Request for a Lab Test                                                                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actor            | Buyer (one who needs the Test) and Seller (who can provides the test)                                                                                                                                                           |
| Main Path        | Initiate the Buyer’s requests                                                                                                                                                                                                   |
|                  | Buyer raises an intent for booking the Lab test as an outcome of Preventive measure                                                                                                                                             |
|                  | Location-based Service Search : Buyers must share their location to have access to all tests/packages serviceable in that area.                                                                                                 |
|                  | Test/Package Selection: Buyers initiate the process by browsing for specific tests (Parameters like Haemoglobin) or packages they require without the necessity of a prescription.                                              |
|                  | Lab Provider Search : Buyers are presented with a curated list of lab providers offering the desired tests or packages.                                                                                                         |
|                  | Sample Collection Preference : Buyers indicate their preference for sample collection, choosing between home collection or visiting the lab's location.                                                                         |
|                  | Date and Time Availability Check : Buyers select their desired date and time for the test, with the system verifying the availability of the chosen tests at the specified schedule.                                            |
|                  | Type of tests available - Where prescription is required or Where Prescription is not required                                                                                                                                  |
|                  | Use case 1 : Buyer trying to book a lab test where prescription is not required                                                                                                                                                 |
|                  | Use Case 2 : Buyer is trying to book a Lab Test where prescription is required                                                                                                                                                  |
|                  | Sellers will mark tests where a prescription is mandatory.                                                                                                                                                                      |
|                  | Buyer App will request the Buyer to keep prescription ready at the time of Sample Collection                                                                                                                                    |
|                  | Buyer needs to present the prescription at the time of Sample Collection to the Phlebo                                                                                                                                          |
| 2                | Broadcast to Sellers                                                                                                                                                                                                            |
|                  | The interest is broadcasted to all the available sellers on the ONDC network via the gateway                                                                                                                                    |
| 3                | Sellers Respond                                                                                                                                                                                                                 |
|                  | Sellers respond with Test/Package Details                                                                                                                                                                                       |
|                  | Description of the Test/Package. For e.g. An LFT assesses the overall health of the Liver.                                                                                                                                      |
|                  | Risk Assessment of the test/package.                                                                                                                                                                                            |
|                  | Number of Tests/Parameters incl Package/Tests. An LFT may include 11 different parameters tested (SGPT, SGOT etc)                                                                                                               |
|                  | Sample collection method i.e. Phlebo may need to draw blood in case of an LFT                                                                                                                                                   |
|                  | Preparation required to do before/after the test. For e.g. intake of glucose is required 1 hr before the test.                                                                                                                  |
|                  | Accreditation Certificate of Seller and its Laboratory. A Lab has to be CAP certified and ISO certification for CBC.                                                                                                            |
|                  | (Not in MVP) Recommendation of tests/package on the basis of the                                                                                                                                                                |
|                  | The tests that are frequently bought together i.e. With Urine Routine and Microscopy test, PPBs is also booked                                                                                                                  |
|                  | Packages that include the test. For e.g. Urine R/M is one test and Users may opt for the Diabetes package and get additional 10 tests at just 10% extra price.                                                                  |
|                  | Recommended for                                                                                                                                                                                                                 |
|                  | User Age Group (A package designed for Senior Citizens)                                                                                                                                                                         |
|                  | Specific genders (A package specifically designed for Womens)                                                                                                                                                                   |
|                  | Lab details:                                                                                                                                                                                                                    |
|                  | For offline : Address, Timings, Days operate                                                                                                                                                                                    |
|                  | For online : they should share the slots available (according to Date, time and Phlebo’s availability.)                                                                                                                         |
|                  | Rescheduling & Cancellations                                                                                                                                                                                                    |
|                  | - Rescheduling because of change in date and time, as per the policies of the Seller. Click here for details                                                                                                                    |
|                  | - Cancellations terms with refund policies from Seller. Discussed here in details. Click here for details                                                                                                                       |
|                  | - Recollection Terms with rescheduling/cancellations policies. Click here for details                                                                                                                                           |
|                  | - Rescheduling due to sample not sufficient/contaminated                                                                                                                                                                        |
|                  | - If the report metric is not published.i.e. Report is not as per the User’s required format.                                                                                                                                   |
| 4                | Offer Management & Selection                                                                                                                                                                                                    |
|                  | Buyer will select the Seller as per his convenience                                                                                                                                                                             |
|                  | Buyer selects the Location for Sample Collection Home                                                                                                                                                                           |
|                  | Buyer to be shown number of Slots available, Slots available, Slot price, Date Wise.                                                                                                                                            |
|                  | Buyer fills in the details like Name(M), Age(M), Gender(M), Contact Details (Optional)                                                                                                                                          |
| 5                | Payment and Confirmation of Order                                                                                                                                                                                               |
|                  | The buyer will make the payment to confirm the order                                                                                                                                                                            |
|                  | Payment can have multiple scenarios, like                                                                                                                                                                                       |
|                  | Pre Fulfilment : The buyer pays for the services in advance and online i.e. at the time of the booking.                                                                                                                         |
|                  | On Fulfilment : The buyer pays for the services at the time of sample collection and offline i.e. before Phlebo collects the sample.                                                                                            |
| 5                | Post Order activities                                                                                                                                                                                                           |
|                  | Once the order is confirmed, the buyer and seller will take relevant actions as per the terms of the order                                                                                                                      |
|                  | Sample to be collected from the location of the buyer                                                                                                                                                                           |
|                  | Location of the buyer to be taken as an input                                                                                                                                                                                   |
|                  | Seller shares a pick up and updates the buyer app with the status of Phlebo (like Assigned from Lab, will arrive at xx:yy, arrived at location)                                                                                 |
|                  | Name of the Phlebo : sample pick up service professional                                                                                                                                                                        |
|                  | Photo of the Phlebo                                                                                                                                                                                                             |
|                  | Contact details of Phlebo and Laboratory                                                                                                                                                                                        |
|                  | Also an OTP is to be shared for the verification of order.                                                                                                                                                                      |
|                  | Once the Phlebo arrives at the Buyer’s Location                                                                                                                                                                                 |
|                  | Re-Confirms the details of the patient via OTP and test descriptions                                                                                                                                                            |
| 6                | Buyer may update the number of the Tests                                                                                                                                                                                        |
|                  | Buyer may increase the number of the patients who wants to be included in the test                                                                                                                                              |
|                  | Buyer may increase the number of patients and update the Packages both.                                                                                                                                                         |
|                  | Once the sample is collected and processed for the required tests, the seller will update the buyer                                                                                                                             |
|                  | By sharing the processing Time of Sample and ETA for report.                                                                                                                                                                    |
|                  | Share the report over Mail/Whatsapp/Buyer App                                                                                                                                                                                   |
| 7                | If the Sample is destroyed or invalid, or the Report generated seems suspicious/invalid, the Sample needs to be collected again.                                                                                                |
|                  | If the Order is cancelled                                                                                                                                                                                                       |
|                  | Seller’s Terms and Conditions are to be followed here which may differ from one to another                                                                                                                                      |
| Alternate Path 1 | Buyer wants to edit the Fulfilment Type/Change in Location of the Service from Walk In Centers to the Home Collection (or another Address) for Tests or vice versa after confirmation of the Test Buyer access the Order Placed |
| Alternate Path 2 | Buyer Modifies the Number of Tests or the Number of patients or both after confirmation of the Test.                                                                                                                            |
| Alternate Path 3 | Rescheduling after the confirmation of Tests Booked                                                                                                                                                                             |
| Alternate Path 4 | Cancellations of the services after Order Confirmation                                                                                                                                                                          |
| Alternate Path 5 | Recollection of the samples after successful sample collection                                                                                                                                                                  |