// Met automatiquement à jour le nom du BC en fonction de la référence de l'étude + le numéro du BC
frappe.ui.form.on('Bon de Commande', {
	ref_etude(frm) {
	    let ref_etude_doc = frm.doc.ref_etude;
	    let numero = 1;
	    frappe.db.count('Bon de Commande',{filters:{'ref_etude':ref_etude_doc}})
            .then(r => {
            numero = r + 1;
            frm.set_value('numero', parseInt(numero));
            frm.set_value('nom_bc', frm.doc.ref_complete_etude + '/BC' + numero);
        });
    }
});
// Fonction permettant d'ajouter les '0' devant les chiffres
function pad(num, size) {
    var s = "00" + num;
    return s.substr(s.length-size);
}
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
	    frm.set_value('total_ht', frm.doc.chiffrage_ht + frm.doc.frais_dossier);
	    frm.set_value('total_ttc', frm.doc.chiffrage_ttc + frm.doc.frais_dossier);
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
        frm.set_value('total_ht', frm.doc.chiffrage_ht + frm.doc.frais_dossier);
	    frm.set_value('total_ttc', frm.doc.chiffrage_ttc + frm.doc.frais_dossier);
    }
});
// Met à jour le chiffrage lorsque les frais de dossier sont changés
frappe.ui.form.on('Bon de Commande',  {
    frais_dossier(frm){
        frm.set_value('total_ht', frm.doc.chiffrage_ht + frm.doc.frais_dossier);
	    frm.set_value('total_ttc', frm.doc.chiffrage_ttc + frm.doc.frais_dossier);
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
// Change le chiffrage de l'étude liée au BC ainsi que la durée en semaines
frappe.ui.form.on('Bon de Commande',  {
    after_save: function(frm) {
        let ref_complete_etude = frm.doc.ref_complete_etude;
        let ref_etude = frm.doc.ref_etude;
        let chiffrage_ht_total = 0;
        let duree_totale = 0;
        let frais_dossier = 0;
        frappe.db.get_list('Bon de Commande', {filters: {'ref_complete_etude': ref_complete_etude}, fields: ['chiffrage_ht', 'frais_dossier', 'duree_en_semaines']})
            .then(r => {
            for(let i = 0; i < r.length; i++){
                chiffrage_ht_total += r[i].chiffrage_ht;
                duree_totale += r[i].duree_en_semaines;
                frais_dossier += r[i].frais_dossier;
            }
            frappe.db.set_value('Etude', ref_etude, {
                chiffrage_ht: chiffrage_ht_total,
                chiffrage_ttc: 1.2 * chiffrage_ht_total,
                duree_en_semaines: duree_totale,
                total_ht: chiffrage_ht_total + frais_dossier,
                total_ttc: 1.2 * chiffrage_ht_total + frais_dossier
            });
        });
    }
});
