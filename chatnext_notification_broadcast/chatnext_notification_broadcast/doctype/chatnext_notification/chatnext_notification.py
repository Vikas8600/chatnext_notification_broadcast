# Copyright (c) 2025, Hybrowlabs and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ChatnextNotification(Document):
	pass


@frappe.whitelist()
def publish_realtime(docname):
	doc = frappe.get_doc("Chatnext Notification", docname)
	if doc.type == "Universal":
		frappe.publish_realtime(
				event="chatnext_notification",
				message={"message": doc},
				after_commit=True,
			)