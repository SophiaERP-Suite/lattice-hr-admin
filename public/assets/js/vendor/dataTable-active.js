(function () {
	'use strict'

	function initDataTable(selector, options) {
		if ($.fn.DataTable && $(selector).length) {
			$(selector).DataTable(options);
		}
	}
	// Initialize all your tables safely
	initDataTable('#datatable-basic', {
		language: {
			searchPlaceholder: 'Search...',
			sSearch: '',
		},
		pageLength: 10
	});
	initDataTable('#responsiveDataTable', {
		responsive: true,
		language: {
			searchPlaceholder: 'Search...',
			sSearch: '',
		},
		pageLength: 5,
		lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]]
	});

	initDataTable('#responsiveDataTableTwo', {
		responsive: true,
		language: {
			searchPlaceholder: 'Search...',
			sSearch: '',
		},
		pageLength: 5,
		lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]]
	});

	$(document).ready(function () {
		const table = $('#contactsDataTable').DataTable({
			columnDefs: [
				{
					orderable: false,
					searchable: false,
					targets: [0]
				}
			],
			responsive: false,
			language: {
				searchPlaceholder: 'Search...',
				sSearch: '',
			},
			pageLength: 10,
			lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
		});

		// Handle custom sorting
		$('.sorting-dropdown').on('change', function () {
			const val = $(this).val();
			if (val) {
				const [colIndex, dir] = val.split('_'); // Split into index and direction
				table.order([parseInt(colIndex), dir]).draw();
			} else {
				table.order([]).draw(); // Reset sorting
			}
		});
	});

	$(document).ready(function () {
		const table = $('#companiesDataTable').DataTable({
			columnDefs: [
				{
					orderable: false,
					searchable: false,
					targets: [0]
				}
			],
			responsive: false,
			language: {
				searchPlaceholder: 'Search...',
				sSearch: '',
			},
			pageLength: 10,
			lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
		});

		// Handle custom sorting
		$('.sorting-dropdown').on('change', function () {
			const val = $(this).val();
			if (val) {
				const [colIndex, dir] = val.split('_'); // Split into index and direction
				table.order([parseInt(colIndex), dir]).draw();
			} else {
				table.order([]).draw(); // Reset sorting
			}
		});
	});

	$(document).ready(function () {
		const table = $('#dealDataTable').DataTable({
			columnDefs: [
				{
					orderable: false,
					searchable: false,
					targets: [0, 1, 12]
				}
			],
			responsive: false,
			language: {
				searchPlaceholder: 'Search...',
				sSearch: '',
			},
			pageLength: 10,
			lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
		});

		// Handle custom sorting
		$('.sorting-dropdown').on('change', function () {
			const val = $(this).val();
			if (val) {
				const [colIndex, dir] = val.split('_'); // Split into index and direction
				table.order([parseInt(colIndex), dir]).draw();
			} else {
				table.order([]).draw(); // Reset sorting
			}
		});
	});


	$(document).ready(function () {
		$('#dataTableDefault').DataTable({
			"bFilter": true,
			ordering: true,
			lengthChange: true,
			columnDefs: [
				{
					orderable: false,
					searchable: false,
					targets: [0]
				}
			],
		});
	});
	$(document).ready(function () {
		$('#dataTableDefaultTwo').DataTable({
			"bFilter": true,
			ordering: true,
			lengthChange: true,
			columnDefs: [
				{
					orderable: false,
					searchable: false,
					targets: [0]
				}
			],
			pageLength: 5,
			lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
		});
	});

	$(document).ready(function () {
		$('#attendanceTable').DataTable({
			"bFilter": true,
			"ordering": false, // 👈 turns off sorting
			"lengthChange": true,
			"pageLength": 10,
			"lengthMenu": [[10, 25, 50, -1], [5, 10, 25, 50, "All"]],
		});
	});
	$(document).ready(function () {
		$('#employeeAttendanceTable').DataTable({
			"bFilter": true,
			"ordering": true,
			"lengthChange": true,
			"pageLength": 10,
		});
	});
	$(document).ready(function () {
		$('#commonTable').DataTable({
			"bFilter": true,
			"ordering": true,
			"lengthChange": true,
			"pageLength": 10,
		});
	});

	// responsive modal datatable
	$('#responsivemodal-DataTable').DataTable({
		responsive: {
			details: {
				display: $.fn.dataTable.Responsive.display.modal({
					header: function (row) {
						var data = row.data();
						return data[0] + ' ' + data[1];
					}
				}),
				renderer: $.fn.dataTable.Responsive.renderer.tableAll({
					tableClass: 'table'
				})
			}
		},
		language: {
			searchPlaceholder: 'Search...',
			sSearch: '',
		},
		"pageLength": 10,
	});
	// responsive modal datatable

	// file export datatable
	$('#file-export').DataTable({
		dom: 'Bfrtip',
		buttons: [
			'copy', 'csv', 'excel', 'pdf', 'print'
		],
		language: {
			searchPlaceholder: 'Search...',
			sSearch: '',
		},
	});
	// file export datatable

	// delete row datatable
	var table = $('#delete-datatable').DataTable({
		language: {
			searchPlaceholder: 'Search...',
			sSearch: '',
		}
	});
	$('#delete-datatable tbody').on('click', 'tr', function () {
		if ($(this).hasClass('selected')) {
			$(this).removeClass('selected');
		}
		else {
			table.$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
		}
	});
	$('#button').on("click", function () {
		table.row('.selected').remove().draw(false);
	});
	// delete row datatable

	// scroll vertical
	$('#scroll-vertical').DataTable({
		scrollY: '265px',
		scrollCollapse: true,
		paging: false,
		scrollX: true,
		language: {
			searchPlaceholder: 'Search...',
			sSearch: '',
		},
	});
	// scroll vertical

	// hidden columns
	$('#hidden-columns').DataTable({
		columnDefs: [
			{
				target: 2,
				visible: false,
				searchable: false,
			},
			{
				target: 3,
				visible: false,
			},
		],
		language: {
			searchPlaceholder: 'Search...',
			sSearch: '',
		},
		"pageLength": 10,
		// scrollX: true
	});
	// hidden columns

	// add row datatable
	var t = $('#add-row').DataTable({

		language: {
			searchPlaceholder: 'Search...',
			sSearch: '',
		},
	});
	var counter = 1;
	$('#addRow').on('click', function () {
		t.row.add([counter + '.1', counter + '.2', counter + '.3', counter + '.4', counter + '.5']).draw(false);
		counter++;
	});
	// add row datatable

	$('#alternativePagination').DataTable({
		pagingType: 'full_numbers'
	});

	$('#complexHeaders').DataTable();
})();