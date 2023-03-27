use MySchedule;


DELIMITER $$
CREATE TRIGGER cap_decr_delete
AFTER DELETE ON Attends
FOR EACH ROW
BEGIN
	UPDATE Component
    SET enrolltot = enrolltot-1
    WHERE id = OLD.cid;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER cap_decr_update
AFTER UPDATE ON Attends
FOR EACH ROW
BEGIN
	UPDATE Component
    SET enrolltot = enrolltot-1
    WHERE id = OLD.cid;
END$$
DELIMITER ;
