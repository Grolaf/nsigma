// Ajoute 1 au nombre d'études réalisées auprès du Client et remplit la référence complète de l'étude automatiquement
frappe.ui.form.on('Etude',  {
	before_save: function(frm) {
		let nombre_etudes = 0;
		let annee_courante = new Date().getFullYear();
		let debut_annee_courante = String(annee_courante) + "01.01 00:00:00";
		// On compte le nombre d'études dans la BDD qui a comme client le même que celui de l'étude que l'on édite actuellement
		frappe.db.count('Etude',{filters:{'nom_client': frm.doc.nom_client, 'date_debut': ['>=', debut_annee_courante]}})
			.then(r => {
				console.log(r);
				nombre_etudes = r;
				// On met à jour le nombre d'études du Client
				// TODO
				frappe.db.set_value('Client', frm.doc.nom_client, {
					nombre_etudes_client : nombre_etudes
				});
				// Enfin, on crée une nouvelle référence pour l'étude
				let annee_creation =  frm.doc.date_debut.substring(0,4);
				let ref_etude =  frm.doc.ref_etude;
				frm.set_value('ref_complete', 'NSIGMA/' + annee_creation + '-' + pad(nombre_etudes, 2) + '/' + ref_etude);
			});
	}
});
// Fonction permettant d'ajouter les '0' devant les chiffres
function pad(num, size) {
	var s = "00" + num;
	return s.substr(s.length-size);
}
// Sélectionne automatiquement les chaffs, CT et quali de l'étude en fonction des membres de chacun de ces pôles
frappe.ui.form.on("Etude", {
	setup: function(frm) {
		frm.set_query("chaff_etude", function() {
			return {
				filters: [
					["Membre","pole", "in", ["Commercial", "Présidence"]]
				]
			};
		});
		frm.set_query("ct_etude", function() {
			return {
				filters: [
					["Membre","pole", "in", ["Technique"]]
				]
			};
		});
		frm.set_query("quali_etude", function() {
			return {
				filters: [
					["Membre","pole", "in", ["Qualité"]]
				]
			};
		});
	}
});
