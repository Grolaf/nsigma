// Itère le numéro du bon de commande auquel correspond le chiffrage
frappe.ui.form.on('Chiffrage Bon de Commande', {
	ref_etude(frm) {
	    let ref_etude_doc = frm.doc.ref_etude;
	    let numero = 1;
	    frappe.db.count('Chiffrage Bon de Commande',{filters:{'ref_etude':ref_etude_doc}})
            .then(r => {
            numero = r + 1;
            frm.set_value('numero_bc', parseInt(numero));
        });
    }
});

// Met automatiquement à jour le prix HT de la phase du BC, ainsi que le chiffrage total du document
frappe.ui.form.on('Phases Bon de Commande Items', {
    prix_du_jeh(frm, cdt, cdn){

        // IMPORTANT : Cette syntaxe permet de modifier les champs d'un item d'une "Child Table"
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'prix_total_ht', (d.prix_du_jeh * d.nombre_de_jeh));

        // Chiffrage total du document
	    let chiffrage_ht_total = 0;
	    frm.doc.phases.forEach(function(d) {
            chiffrage_ht_total += d.prix_total_ht;
        });
        frm.set_value('chiffrage_ht', chiffrage_ht_total);
	    frm.set_value('chiffrage_ttc', 1.2 * chiffrage_ht_total);
    }
});
frappe.ui.form.on('Phases Bon de Commande Items', {
    nombre_de_jeh(frm, cdt, cdn){

        // IMPORTANT : Cette syntaxe permet de modifier les champs d'un item d'une "Child Table"
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'prix_total_ht', (d.prix_du_jeh * d.nombre_de_jeh));

        // Chiffrage total du document
	    let chiffrage_ht_total = 0;
	    frm.doc.phases.forEach(function(d) {
            chiffrage_ht_total += d.prix_total_ht;
        });
        frm.set_value('chiffrage_ht', chiffrage_ht_total);
	    frm.set_value('chiffrage_ttc', 1.2 * chiffrage_ht_total);
    }
});

// Remplit la durée totale en semaines
frappe.ui.form.on('Phases Bon de Commande Items', {
    duree_en_semaines(frm, cdt, cdn){

        let total_semaines = 0;
        frm.doc.phases.forEach(function(d) {
            total_semaines += d.duree_en_semaines;
        });
        frm.set_value('duree_en_semaines', total_semaines);
    }
});
