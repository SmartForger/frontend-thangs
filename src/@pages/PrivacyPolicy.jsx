import React from 'react'
import { Layout } from '@components'

const Page = () => {
  return (
    <div>
      <h2>Who we are</h2>
      <p>
        Thangs.com is registered to Physna, Inc. and our website address is:
        https://physna.com.
      </p>
      <h2>What personal data we collect and why we collect it</h2>
      <br />
      <h3>Comments</h3>
      <p>
        When visitors leave comments on the site we collect the data shown in the comments
        form, and also the visitor’s IP address and browser user agent string to help spam
        detection.
      </p>
      <p>
        An anonymized string created from your email address (also called a hash) may be
        provided to the Gravatar service to see if you are using it. The Gravatar service
        privacy policy is available here: https://automattic.com/privacy/. After approval
        of your comment, your profile picture is visible to the public in the context of
        your comment.
      </p>
      <p>
        Data collection is conducted in order to provide the core services of Physna, Inc.
        to its users, and utilizes artificial intelligence (which interacts with user
        data) for the same. Physna, Inc. collects data from users only in a manner
        consistent with user consent and/or in a manner that serves a legitimate public
        interest.
      </p>
      <p>
        As a general matter, Physna, Inc. is a global company that has approved users
        residing in countries other than the United States. Therefore, you acknowledge and
        understand that data may be transferred to/by Physna, Inc. (and its users)
        pursuant to the terms contained herein, as well as, in the terms and conditions
        set forth applicable to your use (and in accordance with your consent). Physna,
        Inc. complies with any and all regulations set forth in EU General Data Protection
        Regulation (Regulation (EU) 2016/679) (GDPR) and any and all questions about said
        compliance should be directed to counsel for Physna, Inc.
      </p>
      <h3>Media</h3>
      <p>
        If you upload images to the website, you should avoid uploading images with
        embedded location data (EXIF GPS) included. Visitors to the website can download
        and extract any location data from images on the website.
      </p>
      <h3>Contact forms</h3>
      <p>
        We collect name, address, organization, email address, phone number and other
        information that visitors provide through Hubspot, Pendo.io and Sendgrid and this
        data is shared and contained in Physna, Inc.&apos;s marketing and sales automation
        systems. We keep form submission information indefinitely. The information you
        provide will be used for marketing purposes by Physna, Inc.. The information will
        not be shared with third parties.
      </p>
      <h3>Cookies</h3>
      <p>
        If you leave a comment on our site or fill in your information on a form, you may
        opt-in to saving your name, email address and website in cookies. These are for
        your convenience so that you do not have to fill in your details again when you
        leave another comment. These cookies will last for one year.
      </p>
      <p>
        If you visit our login page, we will set a temporary cookie to determine if your
        browser accepts cookies. This cookie contains no personal data and is discarded
        when you close your browser.
      </p>
      <p>
        When you log in, we will also set up several cookies to save your login
        information and your screen display choices. Login cookies last for two days, and
        screen options cookies last for a year. If you select &quot;Remember Me&quot;,
        your login will persist for two weeks. If you log out of your account, the login
        cookies will be removed.
      </p>
      <p>
        If you edit or publish content, an additional cookie will be saved in your
        browser. This cookie includes no personal data and simply indicates the post ID of
        the content you just edited. It expires after 1 day.
      </p>
      <h3>Embedded content from other websites</h3>
      <p>
        This site may include embedded content (e.g. videos, images, articles, etc.).
        Embedded content from other websites behaves in the exact same way as if the
        visitor has visited the other website.
      </p>
      <p>
        These websites may collect data about you, use cookies, embed additional
        third-party tracking, and monitor your interaction with that embedded content,
        including tracking your interaction with the embedded content if you have an
        account and are logged in to that website.
      </p>
      <h3>Analytics</h3>
      <p>
        We want to inform you that whenever you visit our Service, we collect information
        that your browser sends to us that is called Log Data. This Log Data may include
        information such as your computer’s Internet Protocol (&quot;IP&quot;) address,
        browser version, pages of our Service that you visit, the time and date of your
        visit, the time spent on those pages, and other statistics.
      </p>
      <h2>Who we share your data with</h2>
      <p>Physna, Inc. does not share your data with third parties.</p>
      <h2>How long we retain your data</h2>
      <p>
        If you leave a comment, the comment and its metadata are retained indefinitely.
        This is so we can recognize and approve any follow-up comments automatically
        instead of holding them in a moderation queue.
      </p>
      <p>
        For users that register on our website (if any), we also store the personal
        information they provide in their user profile. All users can see, edit, or delete
        their personal information at any time (except they cannot change their username).
        Website administrators can also see and edit that information.
      </p>
      <h2>What rights you have over your data</h2>
      <p>
        If you have an account on this site, or have left comments, you can request to
        receive an exported file of the personal data we hold about you, including any
        data you have provided to us. You can also request that we erase any personal data
        we hold about you. This does not include any data we are obliged to keep for
        administrative, legal, or security purposes.
      </p>
      <h2>Where we send your data</h2>
      <p>Visitor comments may be checked through an automated spam detection service.</p>
      <h2>Your contact information</h2>
      <p>For privacy questions or concerns, please email info@physna.com.</p>
      <h3>How we protect your data</h3>
      <p>
        Your collected data is encrypted and available on a limited basis to Physna, Inc.
        employees.{' '}
      </p>
      <h3>What third parties we receive data from</h3>
      <p>
        Physna, Inc. collects limited data from Third parties, including Google properties
        and social media sites.
      </p>
      <h3>Children&apos;s Privacy</h3>
      <p>
        Our services do not address anyone under the age of 13. We do not knowingly
        collect personal identifiable information from children under 13. In the case we
        discover that a child under 13 has provided us with personal information, we
        immediately delete this from our records. If you are a parent or guardian and you
        are aware that your child has provided us with personal information, please
        contact us at info@physna.com so that we can take the necessary corrective action.
      </p>
      <h3>Changes to this Privacy Policy</h3>
      <p>
        We may update our Privacy Policy from time to time. Thus, we advise that you
        review this page periodically for any changes.
      </p>
    </div>
  )
}

const PrivacyPolicy = () => {
  return (
    <Layout options={{ logoOnly: true }}>
      <Page />
    </Layout>
  )
}

export default PrivacyPolicy
